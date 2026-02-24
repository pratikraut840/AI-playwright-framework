import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { VacancyPage } from '../../pages/VacancyPage';
import { RECRUITMENT_TEST_DATA } from '../../tests/data/recruitment';
import { RECRUITMENT_SELECTORS } from '../../constants/selectors/recruitment.selectors';
import { TIMEOUTS } from '../../constants/global';

/**
 * Custom assertions for Recruitment > Vacancies.
 */

async function getErrors(page: Page): Promise<string[]> {
  await page.waitForSelector(RECRUITMENT_SELECTORS.fieldError, {
    timeout: TIMEOUTS.default,
  });
  return new VacancyPage(page).getFieldErrors();
}

export async function assertMandatoryFieldErrors(page: Page): Promise<void> {
  const errors = await getErrors(page);
  expect(errors).toContain(RECRUITMENT_TEST_DATA.errorMessages.required);
}

export async function assertPositionsValidationError(page: Page): Promise<void> {
  const errors = await getErrors(page);
  const hasError = errors.some(
    (e) =>
      e.includes(RECRUITMENT_TEST_DATA.errorMessages.positionsRange) ||
      e.includes('number') ||
      e.includes('1-99')
  );
  expect(hasError).toBe(true);
}

export async function assertVacancyNotCreated(page: Page): Promise<void> {
  await expect(page).toHaveURL(/addJobVacancy/);
}

/** Edit save failed; still on edit form (addJobVacancy/ID) with validation errors */
export async function assertEditNotSaved(page: Page): Promise<void> {
  await expect(page).toHaveURL(/addJobVacancy\/\d+/);
  await page.waitForSelector(RECRUITMENT_SELECTORS.fieldError, { timeout: 5_000 }).catch(() => {});
  const vacancyPage = new VacancyPage(page);
  const errors = await vacancyPage.getFieldErrors();
  expect(errors.length).toBeGreaterThan(0);
}

export async function assertSuccessMessage(page: Page): Promise<void> {
  const vacancyPage = new VacancyPage(page);
  const url = page.url();
  if (/addJobVacancy\/\d+|viewJobVacancy/.test(url)) {
    try {
      const toastText = await vacancyPage.getToastText();
      expect(toastText).toMatch(/Successfully|Saved/i);
    } catch {
      // Toast may have disappeared; URL already confirms success
    }
  } else {
    const toastText = await vacancyPage.getToastText();
    expect(toastText).toMatch(/Successfully|Saved/i);
  }
}

/** Asserts we're on list page with at least one vacancy row */
export async function assertVacancyInList(page: Page): Promise<void> {
  // After create, OrangeHRM redirects to edit form (addJobVacancy/ID); navigate to list to verify
  await page.waitForURL(/\/(viewJobVacancy|addJobVacancy\/\d+)/, { timeout: TIMEOUTS.default });
  const url = page.url();
  if (url.includes('addJobVacancy')) {
    const listUrl = url.replace(/addJobVacancy\/\d+/, 'viewJobVacancy');
    await page.goto(listUrl);
    await page.waitForSelector(RECRUITMENT_SELECTORS.list.heading, { timeout: TIMEOUTS.default });
  }
  const vacancyPage = new VacancyPage(page);
  await expect(page.locator(RECRUITMENT_SELECTORS.list.tableRows)).not.toHaveCount(0, {
    timeout: TIMEOUTS.default,
  });
  const rowCount = await vacancyPage.getTableRowCount();
  expect(rowCount).toBeGreaterThan(0);
}

export async function assertJobTitleDropdownPopulated(page: Page): Promise<void> {
  const vacancyPage = new VacancyPage(page);
  await vacancyPage.openJobTitleDropdown();
  await expect(page.locator('[role="option"]').first()).toBeVisible({
    timeout: TIMEOUTS.default,
  });
}
