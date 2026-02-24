import * as path from 'path';
import * as dotenv from 'dotenv';

/* Load env before ENV is used – same pattern as BDD hooks */
const ENV_NAME = process.env.NODE_ENV ?? 'dev';
dotenv.config({ path: path.resolve(__dirname, `src/helpers/env/.env.${ENV_NAME}`) });
dotenv.config({ path: path.resolve(__dirname, 'src/helpers/env/.env') });

import { defineConfig, devices } from '@playwright/test';
import { ENV } from './src/helpers/env/env';

/**
 * Playwright config for TDD layer.
 * BDD (Cucumber) uses its own cucumber.mjs config.
 */
export default defineConfig({
  testDir: './src/tdd/specs',
  timeout: 120_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/junit.xml' }],
    ['allure-playwright', { resultsDir: 'allure-results-tdd' }],
  ],

  use: {
    baseURL: ENV.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  globalSetup: require.resolve('./src/tdd/globalSetup.ts'),

  projects: [
    // ─── Chromium (Chrome) ──────────────────────────────────────────────────
    {
      name: 'chromium-login',
      testMatch: /login\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-auth',
      testMatch: /\/(admin|recruitment)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'src/helpers/setupLogin/auth/admin-user.json',
      },
    },
    // ─── Firefox ─────────────────────────────────────────────────────────────
    // {
    //   name: 'firefox-login',
    //   testMatch: /login\.spec\.ts/,
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'firefox-auth',
    //   testMatch: /\/(admin|recruitment)\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: 'src/helpers/setupLogin/auth/admin-user.json',
    //   },
    // },
    // // ─── WebKit (Safari) ─────────────────────────────────────────────────────
    // {
    //   name: 'webkit-login',
    //   testMatch: /login\.spec\.ts/,
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'webkit-auth',
    //   testMatch: /\/(admin|recruitment)\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: 'src/helpers/setupLogin/auth/admin-user.json',
    //   },
    // },
    // ─── Mobile (Playwright default: one Android, one iOS) ────────────────────
    // {
    //   name: 'Mobile Chrome',
    //   testMatch: /login\.spec\.ts/,
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Chrome (auth)',
    //   testMatch: /\/(admin|recruitment)\.spec\.ts/,
    //   use: {
    //     ...devices['Pixel 5'],
    //     storageState: 'src/helpers/setupLogin/auth/admin-user.json',
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   testMatch: /login\.spec\.ts/,
    //   use: { ...devices['iPhone 13'] },
    // },
    // {
    //   name: 'Mobile Safari (auth)',
    //   testMatch: /\/(admin|recruitment)\.spec\.ts/,
    //   use: {
    //     ...devices['iPhone 13'],
    //     storageState: 'src/helpers/setupLogin/auth/admin-user.json',
    //   },
    // },
  ],
});
