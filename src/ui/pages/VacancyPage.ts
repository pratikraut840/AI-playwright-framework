import type { Page } from '@playwright/test';
import { RECRUITMENT_SELECTORS } from '../constants/selectors/recruitment.selectors';
import { TIMEOUTS } from '../constants/global';
import { UI_PATHS } from '../constants/resources';

/**
 * Page Object for Recruitment > Vacancies.
 * Encapsulates UI actions only; assertions live in recruitmentAssertions.ts.
 */
export class VacancyPage {
  constructor(private readonly page: Page) {}

  async gotoVacancies(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}${UI_PATHS.recruitmentVacancies}`, {
      timeout: TIMEOUTS.navigation,
    });
    await this.page.waitForURL(/viewJobVacancy/, { timeout: TIMEOUTS.navigation });
    await this.page.getByRole('heading', { name: /Vacancies/i }).waitFor({ state: 'visible', timeout: TIMEOUTS.navigation });
  }

  async gotoAddVacancy(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}${UI_PATHS.recruitmentAddVacancy}`, {
      timeout: TIMEOUTS.navigation,
    });
    await this.page.waitForSelector(RECRUITMENT_SELECTORS.addForm.heading, {
      timeout: TIMEOUTS.navigation,
    });
  }

  async clickAdd(): Promise<void> {
    await this.page.getByRole('button', { name: /Add/ }).click();
    await this.page.waitForSelector(RECRUITMENT_SELECTORS.addForm.heading, {
      timeout: TIMEOUTS.default,
    });
  }

  async fillVacancyName(name: string): Promise<void> {
    const input = this.formCard.locator(
      'input:not([placeholder]):not([type="checkbox"])'
    ).first();
    await input.fill(name);
  }

  /** Clears the vacancy name field (for edit validation scenario) */
  async clearVacancyName(): Promise<void> {
    const input = this.formCard.locator(
      'input:not([placeholder]):not([type="checkbox"])'
    ).first();
    await input.clear();
    await input.blur();
    await new Promise((r) => setTimeout(r, 200));
  }

  async selectJobTitle(title: string): Promise<void> {
    await this.formCard.locator('.oxd-select-wrapper').first().click();
    await this.page.getByRole('option', { name: title, exact: true }).click({ timeout: TIMEOUTS.default });
    await this.page.keyboard.press('Escape'); // ensure dropdown closes
    await new Promise((r) => setTimeout(r, 300));
  }

  async openJobTitleDropdown(): Promise<void> {
    await this.formCard.locator('.oxd-select-wrapper').first().click();
  }

  async fillDescription(description: string): Promise<void> {
    await this.formCard.getByPlaceholder('Type description here').fill(description);
  }

  async fillHiringManager(hint: string): Promise<void> {
    const input = this.formCard.getByPlaceholder('Type for hints...');
    await input.clear();
    await input.fill(hint);
    await this.page.waitForSelector('[role="option"]', { timeout: TIMEOUTS.default });
    await new Promise((r) => setTimeout(r, 500));
    const options = this.page.locator('[role="option"]').filter({ hasNotText: 'Searching' }).filter({ hasNotText: 'No records found' });
    await options.first().click();
    await new Promise((r) => setTimeout(r, 400));
  }

  /** Fills hint and waits for options to appear (does not select) — for dropdown assertions */
  async showHiringManagerOptions(hint: string): Promise<void> {
    const input = this.formCard.getByPlaceholder('Type for hints...');
    await input.fill(hint);
    await this.page.waitForSelector('[role="option"]', { timeout: TIMEOUTS.default });
  }

  async fillNumberOfPositions(value: string | number): Promise<void> {
    // OrangeHRM form card: inputs are VacancyName(0), HiringManager(1), NumberOfPositions(2)
    const inputs = this.formCard.locator('input:not([type="checkbox"])');
    await inputs.nth(2).fill(String(value));
  }

  async enterMandatoryFields(data: {
    vacancyName: string;
    jobTitle: string;
    hiringManager: string;
    numberOfPositions?: number;
    description?: string;
  }): Promise<void> {
    await this.fillVacancyName(data.vacancyName);
    await this.selectJobTitle(data.jobTitle);
    if (data.description) {await this.fillDescription(data.description);}
    await this.fillHiringManager(data.hiringManager);
    if (data.numberOfPositions !== undefined && data.numberOfPositions !== null) {
      await this.fillNumberOfPositions(data.numberOfPositions);
    }
  }

  async clickSave(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await Promise.race([
      this.page.waitForURL(/viewJobVacancy/, { timeout: 15_000 }),
      this.page.waitForLoadState('networkidle'),
    ]).catch(() => {});
  }

  async getFieldErrors(): Promise<string[]> {
    const locator = this.page.locator(RECRUITMENT_SELECTORS.fieldError);
    const count = await locator.count();
    if (count === 0) {return [];}
    return locator.allInnerTexts();
  }

  async getToastText(): Promise<string> {
    const toast = this.page.locator(RECRUITMENT_SELECTORS.toast);
    await toast.waitFor({ state: 'visible', timeout: TIMEOUTS.default });
    return toast.innerText();
  }

  async getTableRowCount(): Promise<number> {
    return this.page.locator(RECRUITMENT_SELECTORS.list.tableRows).count();
  }

  /** Filter vacancy list by job title */
  async filterByJobTitle(jobTitle: string): Promise<void> {
    const selectWrappers = this.page.locator('.oxd-select-wrapper');
    const count = await selectWrappers.count();
    if (count > 0) {
      await selectWrappers.first().click();
      await this.page.getByRole('option', { name: jobTitle, exact: true }).click({ timeout: TIMEOUTS.default });
      await this.page.getByRole('button', { name: /Search/ }).first().click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  /** Form card for add/edit vacancy form */
  get formCard() {
    return this.page.locator('.orangehrm-card-container').last();
  }
}
