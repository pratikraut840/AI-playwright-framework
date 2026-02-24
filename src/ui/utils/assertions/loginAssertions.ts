import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LOGIN_TEST_DATA } from '../../tests/data/login';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Custom assertions for Login / Dashboard.
 * Use in step definitions; keep expect() calls here.
 */
export async function assertRedirectedToDashboard(page: Page): Promise<void> {
  await expect(page).toHaveURL(new RegExp(LOGIN_TEST_DATA.dashboardPath));
}

export async function assertDashboardHeaderVisible(page: Page): Promise<void> {
  const dashboardPage = new DashboardPage(page);
  const header = await dashboardPage.getHeaderLocator();
  await expect(header).toBeVisible({ timeout: 10000 });
}

export async function assertLoginDenied(page: Page): Promise<void> {
  await expect(page).toHaveURL(new RegExp(LOGIN_TEST_DATA.loginPath));
}

export async function assertInvalidCredentialsError(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  const message = await loginPage.getAlertMessage();
  expect(message.trim()).toBe(LOGIN_TEST_DATA.errorMessages.invalidCredentials);
}

export async function assertUsernameRequiredError(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  const error = await loginPage.getUsernameFieldError();
  expect(error.trim()).toBe(LOGIN_TEST_DATA.errorMessages.requiredField);
}

export async function assertPasswordRequiredError(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  const error = await loginPage.getPasswordFieldError();
  expect(error.trim()).toBe(LOGIN_TEST_DATA.errorMessages.requiredField);
}
