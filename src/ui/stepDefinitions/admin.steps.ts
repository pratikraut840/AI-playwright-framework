import { Given, When, Then } from '@cucumber/cucumber';
import type { OrangeHRMWorld } from '../helpers/hooks/orangeHRMWorld';
import { AdminUserManagementPage } from '../pages/AdminUserManagementPage';
import {
  assertUsernameAlreadyExists,
  assertPasswordTooShortError,
  assertPasswordNoNumberError,
  assertRequiredFieldErrors,
  assertMaxLengthError,
  assertSearchReturnsResults,
  assertAllVisibleUsersAreDisabled,
  assertOnUserManagementPage,
} from '../utils/assertions/adminAssertions';
import { ENV } from '../helpers/env/env';
import { ADMIN_TEST_DATA } from '../tests/data/admin';

// ─── Background ──────────────────────────────────────────────────────────────

// Context is pre-loaded with authenticated state from BeforeAll (login happened once).
// Navigate directly to the User Management page — no login step needed here.
Given('admin is authenticated and on the User Management list page', async function (this: OrangeHRMWorld) {
  const adminPage = new AdminUserManagementPage(this.page);
  await adminPage.goto(ENV.baseUrl);
});

// ─── Navigation ───────────────────────────────────────────────────────────────

When('admin opens the Add User form', async function (this: OrangeHRMWorld) {
  const adminPage = new AdminUserManagementPage(this.page);
  await adminPage.gotoAddUser(ENV.baseUrl);
});

// ─── Form interactions ────────────────────────────────────────────────────────

When('admin enters an already-existing username in the username field', async function (this: OrangeHRMWorld) {
  const adminPage = new AdminUserManagementPage(this.page);
  await adminPage.fillUsernameField(ADMIN_TEST_DATA.existingUsername);
});

When('admin enters a password that is too short', async function (this: OrangeHRMWorld) {
  const adminPage = new AdminUserManagementPage(this.page);
  await adminPage.fillPasswordField(ADMIN_TEST_DATA.passwords.tooShort);
});

When('admin enters a password with no numeric character', async function (this: OrangeHRMWorld) {
  const adminPage = new AdminUserManagementPage(this.page);
  await adminPage.fillPasswordField(ADMIN_TEST_DATA.passwords.noNumber);
});

When('admin enters a username that exceeds the maximum allowed length', async function (this: OrangeHRMWorld) {
  const adminPage = new AdminUserManagementPage(this.page);
  await adminPage.fillUsernameField(ADMIN_TEST_DATA.maxLengthUsername);
});

When('admin clicks Save on the user form', async function (this: OrangeHRMWorld) {
  const adminPage = new AdminUserManagementPage(this.page);
  await adminPage.clickSave();
});

// ─── Search interactions ───────────────────────────────────────────────────────

When('admin searches for users by the known username', async function (this: OrangeHRMWorld) {
  const adminPage = new AdminUserManagementPage(this.page);
  await adminPage.searchByUsername(ADMIN_TEST_DATA.search.existingUsername);
});

When('admin filters the user list by Disabled status', async function (this: OrangeHRMWorld) {
  const adminPage = new AdminUserManagementPage(this.page);
  await adminPage.searchByStatus(ADMIN_TEST_DATA.search.disabledStatus);
});

// ─── Assertions ───────────────────────────────────────────────────────────────

Then('the form should show an already-exists error for the username', async function (this: OrangeHRMWorld) {
  await assertUsernameAlreadyExists(this.page);
});

Then('the form should show a password length validation error', async function (this: OrangeHRMWorld) {
  await assertPasswordTooShortError(this.page);
});

Then('the form should show a minimum numeric character error', async function (this: OrangeHRMWorld) {
  await assertPasswordNoNumberError(this.page);
});

Then('the form should show required field validation errors', async function (this: OrangeHRMWorld) {
  await assertRequiredFieldErrors(this.page);
});

Then('the form should show a maximum length exceeded error for the username', async function (this: OrangeHRMWorld) {
  await assertMaxLengthError(this.page);
});

Then('the user list should contain at least one result', async function (this: OrangeHRMWorld) {
  await assertSearchReturnsResults(this.page);
});

Then('the records count should reflect the filtered results', async function (this: OrangeHRMWorld) {
  await assertOnUserManagementPage(this.page);
});

Then('all displayed users in the list should have Disabled status', async function (this: OrangeHRMWorld) {
  await assertAllVisibleUsersAreDisabled(this.page);
});
