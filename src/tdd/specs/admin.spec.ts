import { test } from '../fixtures';
import {
  assertUsernameAlreadyExists,
  assertPasswordTooShortError,
  assertPasswordNoNumberError,
  assertRequiredFieldErrors,
  assertMaxLengthError,
  assertSearchReturnsResults,
  assertAllVisibleUsersAreDisabled,
} from '../../utils/assertions/adminAssertions';
import { ENV } from '../../helpers/env/env';
import { ADMIN_TEST_DATA } from '../../tests/data/admin';

/**
 * Admin User Management TDD Specs – ported from BDD admin.feature.
 * Requires authenticated context (storageState).
 */
test.describe('Admin Module - User Management - TDD', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto(ENV.baseUrl);
  });

  test('username uniqueness is enforced when a duplicate is submitted', async ({
    adminPage,
    page,
  }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.fillUsernameField(ADMIN_TEST_DATA.existingUsername);
    await adminPage.clickSave();
    await assertUsernameAlreadyExists(page);
  });

  test('password shorter than 7 characters is rejected', async ({ adminPage, page }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.fillPasswordField(ADMIN_TEST_DATA.passwords.tooShort);
    await adminPage.clickSave();
    await assertPasswordTooShortError(page);
  });

  test('password without a numeric character is rejected', async ({ adminPage, page }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.fillPasswordField(ADMIN_TEST_DATA.passwords.noNumber);
    await adminPage.clickSave();
    await assertPasswordNoNumberError(page);
  });

  test('submitting the Add User form with no data shows required errors', async ({
    adminPage,
    page,
  }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.clickSave();
    await assertRequiredFieldErrors(page);
  });

  test('searching by an existing username returns matching results', async ({
    adminPage,
    page,
  }) => {
    await adminPage.searchByUsername(ADMIN_TEST_DATA.search.existingUsername);
    await assertSearchReturnsResults(page);
  });

  test('filtering by Disabled status shows only deactivated users', async ({
    adminPage,
    page,
  }) => {
    await adminPage.searchByStatus(ADMIN_TEST_DATA.search.disabledStatus);
    await assertAllVisibleUsersAreDisabled(page);
  });

  test('username longer than 40 characters is rejected', async ({ adminPage, page }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.fillUsernameField(ADMIN_TEST_DATA.maxLengthUsername);
    await adminPage.clickSave();
    await assertMaxLengthError(page);
  });
});
