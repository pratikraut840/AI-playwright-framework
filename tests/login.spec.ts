/**
 * Playwright spec: Login and dashboard access.
 * Uses framework POM, assertions, and test data from src/.
 * Run: npx playwright test tests/login.spec.ts
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { assertRedirectedToDashboard, assertDashboardHeaderVisible } from '../src/utils/assertions/loginAssertions';
import { env } from '../src/helpers/env/env';

test.describe('OrangeHRM Login', () => {
  test('user logs in with valid credentials and sees dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto(env.baseUrl);
    await loginPage.fillUsername(env.username);
    await loginPage.fillPassword(env.password);
    await loginPage.clickLogin();

    await assertRedirectedToDashboard(page);
    await assertDashboardHeaderVisible(page);
  });
});
