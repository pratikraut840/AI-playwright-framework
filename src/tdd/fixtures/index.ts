import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AdminUserManagementPage } from '../../pages/AdminUserManagementPage';
import { VacancyPage } from '../../pages/VacancyPage';

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

export { expect } from '@playwright/test';
