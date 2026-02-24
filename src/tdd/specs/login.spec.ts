import { test } from '../fixtures';
import {
  assertRedirectedToDashboard,
  assertDashboardHeaderVisible,
  assertLoginDenied,
  assertInvalidCredentialsError,
  assertUsernameRequiredError,
  assertPasswordRequiredError,
} from '../../utils/assertions/loginAssertions';
import { ENV } from '../../helpers/env/env';
import { LOGIN_TEST_DATA } from '../../tests/data/login';

/**
 * Login TDD Specs – ported from BDD login.feature.
 */
test.describe('Login Module- TDD', () => {
  test('successful login and dashboard access', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(ENV.username);
    await loginPage.fillPassword(ENV.password);
    await loginPage.clickLogin();
    await assertRedirectedToDashboard(page);
    await assertDashboardHeaderVisible(page);
  });

  test('login denied with valid username and invalid password', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(ENV.username);
    await loginPage.fillPassword(LOGIN_TEST_DATA.invalidCredentials.password);
    await loginPage.clickLogin();
    await assertLoginDenied(page);
    await assertInvalidCredentialsError(page);
  });

  test('login denied with invalid username and any password', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(LOGIN_TEST_DATA.invalidCredentials.username);
    await loginPage.fillPassword(ENV.password);
    await loginPage.clickLogin();
    await assertLoginDenied(page);
    await assertInvalidCredentialsError(page);
  });

  test('login denied with both username and password incorrect', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(LOGIN_TEST_DATA.invalidCredentials.username);
    await loginPage.fillPassword(LOGIN_TEST_DATA.invalidCredentials.password);
    await loginPage.clickLogin();
    await assertLoginDenied(page);
    await assertInvalidCredentialsError(page);
  });

  test('login denied when both username and password fields are empty', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.clickLogin();
    await assertLoginDenied(page);
    await assertUsernameRequiredError(page);
    await assertPasswordRequiredError(page);
  });

  test('login succeeds with username entered in mixed casing', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(LOGIN_TEST_DATA.mixedCaseUsername);
    await loginPage.fillPassword(ENV.password);
    await loginPage.clickLogin();
    await assertRedirectedToDashboard(page);
    await assertDashboardHeaderVisible(page);
  });

  test('login denied when password contains leading and trailing spaces', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(ENV.username);
    await loginPage.fillPassword(`  ${ENV.password}  `);
    await loginPage.clickLogin();
    await assertLoginDenied(page);
    await assertInvalidCredentialsError(page);
  });

  test('login succeeds with a password containing special characters', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(ENV.specialCharsUsername);
    await loginPage.fillPassword(ENV.specialCharsPassword);
    await loginPage.clickLogin();
    await assertRedirectedToDashboard(page);
    await assertDashboardHeaderVisible(page);
  });
});
