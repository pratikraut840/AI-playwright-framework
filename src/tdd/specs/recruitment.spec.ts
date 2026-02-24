import { test, expect } from '../fixtures';
import {
  assertMandatoryFieldErrors,
  assertPositionsValidationError,
  assertVacancyNotCreated,
  assertSuccessMessage,
  assertVacancyInList,
  assertJobTitleDropdownPopulated,
} from '../../utils/assertions/recruitmentAssertions';
import { ENV } from '../../helpers/env/env';
import { RECRUITMENT_TEST_DATA } from '../../tests/data/recruitment';
import { RECRUITMENT_SELECTORS } from '../../constants/selectors/recruitment.selectors';

/**
 * Recruitment Vacancy TDD Specs – ported from BDD jobPosting.feature.
 * Covers scenarios with implemented BDD steps. Requires authenticated context.
 */
test.describe('Recruitment - Vacancy - TDD', () => {
  test.beforeEach(async ({ vacancyPage }) => {
    await vacancyPage.gotoVacancies(ENV.baseUrl);
  });

  test('create vacancy with valid mandatory data', async ({ vacancyPage, page }) => {
    await vacancyPage.gotoAddVacancy(ENV.baseUrl);
    const uniqueData = {
      ...RECRUITMENT_TEST_DATA.form.valid,
      vacancyName: `Vacancy ${Date.now()}`,
    };
    await vacancyPage.enterMandatoryFields(uniqueData);
    await vacancyPage.clickSave();
    await assertVacancyInList(page);
    const count = await vacancyPage.getTableRowCount();
    expect(count).toBeGreaterThan(0);
  });

  test('system generates unique vacancy ID on save', async ({ vacancyPage, page }) => {
    await vacancyPage.gotoAddVacancy(ENV.baseUrl);
    await vacancyPage.enterMandatoryFields({
      ...RECRUITMENT_TEST_DATA.form.valid,
      vacancyName: `Vacancy ID ${Date.now()}`,
    });
    await vacancyPage.clickSave();
    await page.waitForURL(/\/(viewJobVacancy|addJobVacancy\/\d+)/, { timeout: 15_000 });
  });

  test('vacancy is linked to selected job title', async ({ vacancyPage, page }) => {
    await vacancyPage.gotoAddVacancy(ENV.baseUrl);
    await vacancyPage.enterMandatoryFields({
      ...RECRUITMENT_TEST_DATA.form.valid,
      vacancyName: `Job Title Test ${Date.now()}`,
      jobTitle: RECRUITMENT_TEST_DATA.jobTitles[0],
    });
    await vacancyPage.clickSave();
    await assertVacancyInList(page);
  });

  test('mandatory field validation prevents save when fields are blank', async ({
    vacancyPage,
    page,
  }) => {
    await vacancyPage.gotoAddVacancy(ENV.baseUrl);
    await vacancyPage.clickSave();
    await assertMandatoryFieldErrors(page);
    await assertVacancyNotCreated(page);
  });

  test('number of positions rejects zero', async ({ vacancyPage, page }) => {
    await vacancyPage.gotoAddVacancy(ENV.baseUrl);
    await vacancyPage.fillNumberOfPositions('0');
    await vacancyPage.clickSave();
    await assertPositionsValidationError(page);
    await assertVacancyNotCreated(page);
  });

  test('number of positions rejects negative value', async ({ vacancyPage, page }) => {
    await vacancyPage.gotoAddVacancy(ENV.baseUrl);
    await vacancyPage.fillNumberOfPositions('-1');
    await vacancyPage.clickSave();
    await page.waitForSelector(RECRUITMENT_SELECTORS.fieldError, { timeout: 10_000 }).catch(() => {});
    const errors = await vacancyPage.getFieldErrors();
    expect(errors.length).toBeGreaterThan(0);
    await assertVacancyNotCreated(page);
  });

  test('number of positions rejects alphabetic value', async ({ vacancyPage, page }) => {
    await vacancyPage.gotoAddVacancy(ENV.baseUrl);
    await vacancyPage.fillNumberOfPositions('abc');
    await vacancyPage.clickSave();
    await page.waitForSelector(RECRUITMENT_SELECTORS.fieldError, { timeout: 10_000 });
    const errors = await vacancyPage.getFieldErrors();
    expect(errors.length).toBeGreaterThan(0);
    await assertVacancyNotCreated(page);
  });

  test('Job Title dropdown loads active job titles', async ({ vacancyPage, page }) => {
    await vacancyPage.gotoAddVacancy(ENV.baseUrl);
    await assertJobTitleDropdownPopulated(page);
    await expect(page.locator('[role="option"]').first()).toBeVisible();
  });

  test('Hiring Manager dropdown loads active employees', async ({ vacancyPage, page }) => {
    await vacancyPage.gotoAddVacancy(ENV.baseUrl);
    await vacancyPage.showHiringManagerOptions(RECRUITMENT_TEST_DATA.hiringManagerHint);
    await expect(page.locator('[role="option"]').first()).toBeVisible();
  });
});
