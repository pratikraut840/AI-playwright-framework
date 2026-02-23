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

export async function assertSuccessMessage(page: Page): Promise<void> {
  const vacancyPage = new VacancyPage(page);
  const toastText = await vacancyPage.getToastText();
  expect(toastText).toContain(RECRUITMENT_TEST_DATA.successMessage);
}

export async function assertVacancyInList(page: Page): Promise<void> {
  await expect(page).toHaveURL(/viewJobVacancy/);
  const vacancyPage = new VacancyPage(page);
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
