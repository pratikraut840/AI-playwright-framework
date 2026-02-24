import * as path from 'path';
import * as dotenv from 'dotenv';

/* Load env before ENV is used – same pattern as BDD hooks */
const ENV_NAME = process.env.NODE_ENV ?? 'dev';
dotenv.config({ path: path.resolve(__dirname, `src/helpers/env/.env.${ENV_NAME}`) });
dotenv.config({ path: path.resolve(__dirname, 'src/helpers/env/.env') });

import { defineConfig, devices } from '@playwright/test';
import { ENV } from './src/helpers/env/env';

/** Spec names (without .spec.ts) that run without pre-login – add new ones here */
const GUEST_SPECS = ['login'];

/** Spec names that require authenticated storage state – add new ones here */
const AUTHORIZED_SPECS = ['admin', 'recruitment'];

const guestMatch = new RegExp(`(${GUEST_SPECS.join('|')})\\.spec\\.ts$`);
const authorizedMatch = new RegExp(`(${AUTHORIZED_SPECS.join('|')})\\.spec\\.ts$`);

const STORAGE_STATE = 'src/helpers/setupLogin/auth/admin-user.json';

/**
 * Playwright config for TDD layer.
 * BDD (Cucumber) uses its own cucumber.mjs config.
 */
export default defineConfig({
  testDir: './src/tdd/specs',
  outputDir: 'test-results',
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
    {
      name: 'chromium',
      testMatch: guestMatch,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-authorized',
      testMatch: authorizedMatch,
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
    },
    {
      name: 'firefox',
      testMatch: guestMatch,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'firefox-authorized',
      testMatch: authorizedMatch,
      use: {
        ...devices['Desktop Firefox'],
        storageState: STORAGE_STATE,
      },
    },
    {
      name: 'webkit',
      testMatch: guestMatch,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'webkit-authorized',
      testMatch: authorizedMatch,
      use: {
        ...devices['Desktop Safari'],
        storageState: STORAGE_STATE,
      },
    },
    {
      name: 'mobile-chromium',
      testMatch: guestMatch,
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-chromium-authorized',
      testMatch: authorizedMatch,
      use: {
        ...devices['Pixel 5'],
        storageState: STORAGE_STATE,
      },
    },
    {
      name: 'mobile-webkit',
      testMatch: guestMatch,
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'mobile-webkit-authorized',
      testMatch: authorizedMatch,
      use: {
        ...devices['iPhone 13'],
        storageState: STORAGE_STATE,
      },
    },
  ],
});
