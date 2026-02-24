/**
 * TDD Global Setup – creates authenticated storage state for specs that need pre-login.
 * Mirrors BDD BeforeAll auth flow; both BDD and TDD share the same auth file.
 * Login specs run without storage state; admin/recruitment TDD specs use it.
 */
import * as path from 'path';
import * as dotenv from 'dotenv';
import { chromium } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ENV } from '../helpers/env/env';

const AUTH_STATE_PATH = path.join('src', 'helpers', 'setupLogin', 'auth', 'admin-user.json');

async function globalSetup(): Promise<void> {
  const ENV_NAME = process.env.NODE_ENV ?? 'dev';
  dotenv.config({ path: path.join('src', 'helpers', 'env', `.env.${ENV_NAME}`) });
  dotenv.config({ path: path.join('src', 'helpers', 'env', '.env') });

  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto(ENV.baseUrl);
    await loginPage.login(ENV.username, ENV.password);
    await page.waitForURL(/dashboard/, { timeout: 60_000 });
    await context.storageState({ path: AUTH_STATE_PATH });
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
