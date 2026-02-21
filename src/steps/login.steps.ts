/**
 * Step definitions for Login feature.
 *
 * To run with Cucumber: add @cucumber/cucumber and configure a World with Playwright page.
 * Example registration:
 *   Given('user is on login page', async function (this: World) { await loginSteps.givenUserIsOnLoginPage(this.page); });
 *
 * The same logic is used by tests/login.spec.ts (standalone Playwright).
 */
import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { assertRedirectedToDashboard, assertDashboardHeaderVisible } from '../utils/assertions/loginAssertions';
import { env } from '../helpers/env/env';

/** Step: user is on login page */
export async function givenUserIsOnLoginPage(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto(env.baseUrl);
}

/** Step: user enters valid username & password */
export async function whenUserEntersValidCredentials(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.fillUsername(env.username);
  await loginPage.fillPassword(env.password);
}

/** Step: clicks Login */
export async function whenUserClicksLogin(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.clickLogin();
}

/** Step: user should be redirected to Dashboard */
export async function thenUserRedirectedToDashboard(page: Page): Promise<void> {
  await assertRedirectedToDashboard(page);
}

/** Step: dashboard header should be visible */
export async function thenDashboardHeaderVisible(page: Page): Promise<void> {
  await assertDashboardHeaderVisible(page);
}
