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
    await this.page.waitForSelector(RECRUITMENT_SELECTORS.list.heading, {
      timeout: TIMEOUTS.navigation,
    });
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
    await this.formCard.locator('input:not([type="checkbox"])').first().fill(name);
  }

  async selectJobTitle(title: string): Promise<void> {
    await this.formCard.locator('.oxd-select-wrapper').first().click();
    await this.page.getByRole('option', { name: title }).click();
  }

  async openJobTitleDropdown(): Promise<void> {
    await this.formCard.locator('.oxd-select-wrapper').first().click();
  }

  async fillDescription(description: string): Promise<void> {
    await this.formCard.getByPlaceholder('Type description here').fill(description);
  }

  async fillHiringManager(hint: string): Promise<void> {
    const input = this.formCard.getByPlaceholder('Type for hints...');
    await input.fill(hint);
    await this.page.waitForSelector('[role="option"]', { timeout: TIMEOUTS.default });
    await this.page.locator('[role="option"]').first().click();
  }

  async fillNumberOfPositions(value: string | number): Promise<void> {
    /** Form has: VacancyName(0), Description(1), HiringManager(2), NumberOfPositions(3) */
    const inputs = this.formCard.locator('input:not([type="checkbox"])');
    await inputs.nth(3).fill(String(value));
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
    if (data.description) await this.fillDescription(data.description);
    await this.fillHiringManager(data.hiringManager);
    if (data.numberOfPositions != null) {
      await this.fillNumberOfPositions(data.numberOfPositions);
    }
  }

  async clickSave(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async getFieldErrors(): Promise<string[]> {
    const locator = this.page.locator(RECRUITMENT_SELECTORS.fieldError);
    const count = await locator.count();
    if (count === 0) return [];
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

  /** Form card locator for add/edit vacancy form */
  get formCard() {
    return this.page.locator('.orangehrm-card-container').last();
  }
}
