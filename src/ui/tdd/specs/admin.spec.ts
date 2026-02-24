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
 * Admin · User Management TDD Specs – ported from BDD admin.feature.
 * Requires authenticated context (storageState).
 */
test.describe('Admin · User Management', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto(ENV.baseUrl);
  });

  test('Verify username uniqueness is enforced when duplicate is submitted @regression', async ({
    adminPage,
    page,
  }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.fillUsernameField(ADMIN_TEST_DATA.existingUsername);
    await adminPage.clickSave();
    await assertUsernameAlreadyExists(page);
  });

  test('Verify password shorter than 7 characters is rejected @regression', async ({ adminPage, page }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.fillPasswordField(ADMIN_TEST_DATA.passwords.tooShort);
    await adminPage.clickSave();
    await assertPasswordTooShortError(page);
  });

  test('Verify password without numeric character is rejected @regression', async ({ adminPage, page }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.fillPasswordField(ADMIN_TEST_DATA.passwords.noNumber);
    await adminPage.clickSave();
    await assertPasswordNoNumberError(page);
  });

  test('Verify required field errors are shown when Add User form is submitted empty @regression', async ({
    adminPage,
    page,
  }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.clickSave();
    await assertRequiredFieldErrors(page);
  });

  test('Verify search by existing username returns matching results @smoke @regression', async ({
    adminPage,
    page,
  }) => {
    await adminPage.searchByUsername(ADMIN_TEST_DATA.search.existingUsername);
    await assertSearchReturnsResults(page);
  });

  test('Verify filtering by Disabled status shows only deactivated users @regression', async ({
    adminPage,
    page,
  }) => {
    await adminPage.searchByStatus(ADMIN_TEST_DATA.search.disabledStatus);
    await assertAllVisibleUsersAreDisabled(page);
  });

  test('Verify username longer than 40 characters is rejected @regression', async ({ adminPage, page }) => {
    await adminPage.gotoAddUser(ENV.baseUrl);
    await adminPage.fillUsernameField(ADMIN_TEST_DATA.maxLengthUsername);
    await adminPage.clickSave();
    await assertMaxLengthError(page);
  });
});
