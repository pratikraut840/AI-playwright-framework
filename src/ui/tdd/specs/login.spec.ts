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
 * Login · Authentication TDD Specs – ported from BDD login.feature.
 */
test.describe('Login · Authentication', () => {
  test('Verify successful login and dashboard access @smoke @regression', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(ENV.username);
    await loginPage.fillPassword(ENV.password);
    await loginPage.clickLogin();
    await assertRedirectedToDashboard(page);
    await assertDashboardHeaderVisible(page);
  });

  test('Verify login is denied with valid username and invalid password @regression', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(ENV.username);
    await loginPage.fillPassword(LOGIN_TEST_DATA.invalidCredentials.password);
    await loginPage.clickLogin();
    await assertLoginDenied(page);
    await assertInvalidCredentialsError(page);
  });

  test('Verify login is denied with invalid username and any password @regression', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(LOGIN_TEST_DATA.invalidCredentials.username);
    await loginPage.fillPassword(ENV.password);
    await loginPage.clickLogin();
    await assertLoginDenied(page);
    await assertInvalidCredentialsError(page);
  });

  test('Verify login is denied when both username and password are incorrect @regression', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(LOGIN_TEST_DATA.invalidCredentials.username);
    await loginPage.fillPassword(LOGIN_TEST_DATA.invalidCredentials.password);
    await loginPage.clickLogin();
    await assertLoginDenied(page);
    await assertInvalidCredentialsError(page);
  });

  test('Verify login is denied when username and password fields are empty @regression', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.clickLogin();
    await assertLoginDenied(page);
    await assertUsernameRequiredError(page);
    await assertPasswordRequiredError(page);
  });

  test('Verify login succeeds with username in mixed casing @regression', async ({ loginPage, page }) => {
    await loginPage.goto(ENV.baseUrl);
    await loginPage.fillUsername(LOGIN_TEST_DATA.mixedCaseUsername);
    await loginPage.fillPassword(ENV.password);
    await loginPage.clickLogin();
    await assertRedirectedToDashboard(page);
    await assertDashboardHeaderVisible(page);
  });

  test('Verify login is denied when password contains leading and trailing spaces @regression', async ({
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

  test('Verify login succeeds with password containing special characters @regression', async ({
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
