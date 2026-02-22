import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { AdminUserManagementPage } from '../../pages/AdminUserManagementPage';
import { ADMIN_TEST_DATA } from '../../tests/data/admin';
import { ADMIN_SELECTORS } from '../../constants/selectors/admin.selectors';
import { TIMEOUTS } from '../../constants/global';

/**
 * Custom assertions for Admin > User Management.
 * Use in step definitions; all expect() calls live here.
 */

async function getErrors(page: Page): Promise<string[]> {
  return new AdminUserManagementPage(page).getFieldErrors();
}

export async function assertFieldErrorContains(page: Page, expected: string): Promise<void> {
  const errors = await getErrors(page);
  expect(errors).toContain(expected);
}

export async function assertUsernameAlreadyExists(page: Page): Promise<void> {
  await assertFieldErrorContains(page, ADMIN_TEST_DATA.errorMessages.alreadyExists);
}

export async function assertPasswordTooShortError(page: Page): Promise<void> {
  await assertFieldErrorContains(page, ADMIN_TEST_DATA.errorMessages.passwordTooShort);
}

export async function assertPasswordNoNumberError(page: Page): Promise<void> {
  await assertFieldErrorContains(page, ADMIN_TEST_DATA.errorMessages.passwordNoNumber);
}

export async function assertRequiredFieldErrors(page: Page): Promise<void> {
  await assertFieldErrorContains(page, ADMIN_TEST_DATA.errorMessages.required);
}

export async function assertMaxLengthError(page: Page): Promise<void> {
  await assertFieldErrorContains(page, ADMIN_TEST_DATA.errorMessages.maxLengthExceeded);
}

export async function assertSearchReturnsResults(page: Page): Promise<void> {
  /** Retry-able — waits for Vue.js to re-render the table after the search API call */
  await expect(page.locator(ADMIN_SELECTORS.list.tableRows)).not.toHaveCount(0, {
    timeout: TIMEOUTS.default,
  });
  const adminPage = new AdminUserManagementPage(page);
  const countText = await adminPage.getRecordsCountText();
  expect(countText).toMatch(/\(\d+\) Record/);
  const rowCount = await adminPage.getTableRowCount();
  expect(rowCount).toBeGreaterThan(0);
}

export async function assertOnUserManagementPage(page: Page): Promise<void> {
  await expect(page).toHaveURL(/viewSystemUsers/);
}

export async function assertAllVisibleUsersAreDisabled(page: Page): Promise<void> {
  /** Retry-able — waits for filtered results to render before reading status cells */
  await expect(page.locator(ADMIN_SELECTORS.list.tableRows)).not.toHaveCount(0, {
    timeout: TIMEOUTS.default,
  });
  const adminPage = new AdminUserManagementPage(page);
  const statusTexts = await adminPage.getStatusCellTexts();
  expect(statusTexts.length).toBeGreaterThan(0);
  for (const status of statusTexts) {
    expect(status.trim()).toBe('Disabled');
  }
}
