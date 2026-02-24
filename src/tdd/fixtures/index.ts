import * as fs from 'fs';
import * as path from 'path';
import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AdminUserManagementPage } from '../../pages/AdminUserManagementPage';
import { VacancyPage } from '../../pages/VacancyPage';

/** Directory where Playwright (TDD) failure screenshots are saved */
const PLAYWRIGHT_SCREENSHOT_DIR = path.join('playwright-report', 'playwright-screenshots');

/**
 * TDD Fixtures – extend Playwright's base test with pre-instantiated Page Objects.
 * Replaces Cucumber World-style injection; both BDD and TDD share the same POM layer.
 */
export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  adminPage: AdminUserManagementPage;
  vacancyPage: VacancyPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminUserManagementPage(page));
  },
  vacancyPage: async ({ page }, use) => {
    await use(new VacancyPage(page));
  },
});

// Save a screenshot to playwright-report/playwright-screenshots when a test fails
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus && page) {
    fs.mkdirSync(PLAYWRIGHT_SCREENSHOT_DIR, { recursive: true });
    const safeTitle = testInfo.title.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 80);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(
      PLAYWRIGHT_SCREENSHOT_DIR,
      `${testInfo.project.name}-${safeTitle}-${timestamp}.png`,
    );
    await page.screenshot({ path: filePath, type: 'png' }).catch(() => {
      // Page may already be closed; ignore
    });
  }
});

export { expect } from '@playwright/test';
