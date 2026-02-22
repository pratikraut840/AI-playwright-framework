import { Given, When, Then } from '@cucumber/cucumber';
import type { OrangeHRMWorld } from '../helpers/hooks/orangeHRMWorld';
import { LoginPage } from '../pages/LoginPage';
import {
  assertRedirectedToDashboard,
  assertDashboardHeaderVisible,
  assertLoginDenied,
  assertInvalidCredentialsError,
  assertUsernameRequiredError,
  assertPasswordRequiredError,
} from '../utils/assertions/loginAssertions';
import { ENV } from '../helpers/env/env';
import { LOGIN_TEST_DATA } from '../tests/data/login';

Given('user is on login page', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto(ENV.baseUrl);
});

When('user enters valid username & password', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(ENV.username);
  await loginPage.fillPassword(ENV.password);
});

When('clicks Login', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickLogin();
});

Then('user should be redirected to Dashboard', async function (this: OrangeHRMWorld) {
  await assertRedirectedToDashboard(this.page);
});

Then('dashboard header should be visible', async function (this: OrangeHRMWorld) {
  await assertDashboardHeaderVisible(this.page);
});

When('user enters a valid username and an invalid password', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(ENV.username);
  await loginPage.fillPassword(LOGIN_TEST_DATA.invalidCredentials.password);
});

When('user enters an invalid username and any password', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(LOGIN_TEST_DATA.invalidCredentials.username);
  await loginPage.fillPassword(ENV.password);
});

When('user enters both username and password incorrectly', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(LOGIN_TEST_DATA.invalidCredentials.username);
  await loginPage.fillPassword(LOGIN_TEST_DATA.invalidCredentials.password);
});

When('user submits the login form without entering any credentials', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickLogin();
});

Then('login should be denied', async function (this: OrangeHRMWorld) {
  await assertLoginDenied(this.page);
});

Then('an invalid credentials error should be displayed', async function (this: OrangeHRMWorld) {
  await assertInvalidCredentialsError(this.page);
});

Then('a required error should be displayed for the username field', async function (this: OrangeHRMWorld) {
  await assertUsernameRequiredError(this.page);
});

Then('a required error should be displayed for the password field', async function (this: OrangeHRMWorld) {
  await assertPasswordRequiredError(this.page);
});

When('user enters valid username in mixed casing with the correct password', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(LOGIN_TEST_DATA.mixedCaseUsername);
  await loginPage.fillPassword(ENV.password);
});

When('user enters valid username and password with leading and trailing spaces', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(ENV.username);
  await loginPage.fillPassword(`  ${ENV.password}  `);
});

When('user enters valid username and a password with special characters', async function (this: OrangeHRMWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(ENV.specialCharsUsername);
  await loginPage.fillPassword(ENV.specialCharsPassword);
});
