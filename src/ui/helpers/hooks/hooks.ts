import * as fs from 'fs';
import * as path from 'path';
import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  setWorldConstructor,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import * as dotenv from 'dotenv';
import * as allure from 'allure-js-commons';
import { ContentType } from 'allure-js-commons';
import type { Browser, Video } from '@playwright/test';
import type { ITestCaseHookParameter } from '@cucumber/cucumber';
import { OrangeHRMWorld } from './orangeHRMWorld';
import { launchBrowser } from '../browsers/browserSetup';
import { LoginPage } from '../../pages/LoginPage';
import { ENV } from '../env/env';

// Load environment-specific .env file first, then fall back to base .env
const ENV_NAME = process.env.NODE_ENV ?? 'dev';
dotenv.config({ path: `src/ui/helpers/env/.env.${ENV_NAME}` });
dotenv.config({ path: 'src/ui/helpers/env/.env' });

// ─── Shared state (module-level) ─────────────────────────────────────────────

/** Single browser instance for the whole run */
let sharedBrowser: Browser | null = null;

/** File path where authenticated cookies/storage are saved after one login */
const AUTH_STATE_FILE  = path.join('src', 'ui', 'helpers', 'setupLogin', 'auth', 'admin-user.json');
const SCREENSHOT_DIR   = path.join('test-results', 'test-results-bdd', 'cucumber-html-report', 'screenshots');
const VIDEO_DIR        = path.join('test-results', 'test-results-bdd', 'cucumber-html-report', 'videos');

setWorldConstructor(OrangeHRMWorld);
setDefaultTimeout(120 * 1000);

// Add thread label so it shows in the Allure report (BDD runs single process; use 0 or env)
Before(async function () {
  await allure.label('thread', process.env.TEST_PARALLEL_INDEX ?? '0');
});

// ─── BeforeAll ────────────────────────────────────────────────────────────────
// Runs ONCE before the entire test run.
// 1. Launches the shared browser.
// 2. Performs a single login and saves the authenticated browser storage state
//    (cookies + localStorage) to disk so admin scenarios can reuse it.

BeforeAll(async function (this: { parameters: Record<string, unknown> }) {
  // BDD dirs are cleared by run-bdd-tests.mjs before cucumber starts (clearing here would delete formatter output)
  const headless = process.env.HEADLESS !== 'false';
  sharedBrowser = await launchBrowser({ headless });

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(AUTH_STATE_FILE), { recursive: true });

  // Perform one login and capture the resulting browser state (with retry for flaky demo site)
  const authContext = await sharedBrowser.newContext();
  const authPage = await authContext.newPage();
  try {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const loginPage = new LoginPage(authPage);
        await loginPage.goto(ENV.baseUrl);
        await loginPage.login(ENV.username, ENV.password);
        await authPage.waitForURL(/dashboard/, { timeout: 90_000 });
        await authContext.storageState({ path: AUTH_STATE_FILE });
        break;
      } catch (err) {
        if (attempt === 2) {throw err;}
        await authPage.goto(ENV.baseUrl + '/web/index.php/auth/login', { waitUntil: 'commit', timeout: 30_000 }).catch(() => {});
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  } finally {
    await authPage.close();
    await authContext.close();
  }
});

// ─── Before: @login scenarios ────────────────────────────────────────────────
// Login feature tests the login flow itself, so each scenario starts on a
// fresh, unauthenticated page — no pre-loaded auth state.
// Video is recorded for every scenario; kept only on failure (see After).

Before({ tags: '@login' }, async function (this: OrangeHRMWorld) {
  if (!sharedBrowser) {
    throw new Error('BeforeAll did not run: sharedBrowser is null');
  }
  this.browser = sharedBrowser;
  this.context = await this.browser.newContext({
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 720 } },
  });
  this.page = await this.context.newPage();
});

// ─── Before: @admin scenarios ────────────────────────────────────────────────
// Admin scenarios reuse the storage state saved in BeforeAll, so no login
// step is required inside the scenarios themselves.
// Video is recorded for every scenario; kept only on failure (see After).

// Admin and Recruitment share auth state — both need logged-in admin session.
Before({ tags: '@admin or @recruitment' }, async function (this: OrangeHRMWorld) {
  if (!sharedBrowser) {
    throw new Error('BeforeAll did not run: sharedBrowser is null');
  }
  this.browser = sharedBrowser;
  this.context = await this.browser.newContext({
    storageState: AUTH_STATE_FILE,
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 720 } },
  });
  this.page = await this.context.newPage();
});

// ─── After ────────────────────────────────────────────────────────────────────
// Runs after every scenario.
// On FAILURE:
//   1. Capture and attach a screenshot.
//   2. Close the page and context (this finalises the video).
//   3. Save the video with a readable filename and attach it to the report.
// On PASS:
//   1. Close page and context.
//   2. Delete the video recording to save disk space.

After(async function (this: OrangeHRMWorld, scenario: ITestCaseHookParameter) {
  const FAILED = scenario.result?.status === 'FAILED';
  const PASSED = scenario.result?.status === 'PASSED';
  const safeName = scenario.pickle.name.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 80);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // ── 1. Screenshot on failure (captured while page is still open) ───────────
  if (FAILED && this.page) {
    try {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
      const screenshotPath = path.join(SCREENSHOT_DIR, `${safeName}-${timestamp}.png`);
      const screenshot = await this.page.screenshot({ path: screenshotPath, type: 'png' });
      this.attach(screenshot, 'image/png');
      await allure.attachment('Screenshot on failure', screenshot, ContentType.PNG);
    } catch (err) {
      console.error('[After] Screenshot capture failed:', err);
    }
  }

  // ── 2. Grab video reference BEFORE closing page/context ────────────────────
  const video: Video | null = this.page?.video() ?? null;

  // ── 3. Close page then context — closing context finalises the video file ──
  await this.page?.close().catch(() => {});
  await this.context?.close().catch(() => {});

  // ── 4. Handle the recorded video (saveAs waits for video to be ready) ────────
  if (video && FAILED) {
    try {
      fs.mkdirSync(VIDEO_DIR, { recursive: true });
      const videoPath = path.join(VIDEO_DIR, `${safeName}-${timestamp}.mp4`);
      await video.saveAs(videoPath);
      const videoBuffer = fs.readFileSync(videoPath);
      this.attach(videoBuffer, 'video/mp4');
    } catch (err) {
      console.error('[After] Video save failed:', err);
    }
  } else if (video && PASSED) {
    await video.delete().catch(() => {});
  }
});

// ─── AfterAll ─────────────────────────────────────────────────────────────────
// Runs ONCE after the entire test run — closes the shared browser.

AfterAll(async function (this: { parameters: Record<string, unknown> }) {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
});
