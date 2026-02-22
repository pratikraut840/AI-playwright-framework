import type { Page } from '@playwright/test';
import { ADMIN_SELECTORS } from '../constants/selectors/admin.selectors';
import { TIMEOUTS } from '../constants/global';
import type { UserRole, UserStatus } from '../types/admin.types';

/**
 * Page Object for Admin > User Management.
 * Encapsulates UI actions only; assertions live in adminAssertions.ts.
 */
export class AdminUserManagementPage {
  /** Scope form interactions inside the card container to avoid the global sidebar search */
  private readonly formCard = this.page.locator('.orangehrm-card-container').last();

  constructor(private readonly page: Page) {}

  // ─── Navigation ───────────────────────────────────────────────────────────

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/web/index.php/admin/viewSystemUsers`, {
      timeout: TIMEOUTS.navigation,
    });
    await this.page.waitForSelector(ADMIN_SELECTORS.list.heading, { timeout: TIMEOUTS.navigation });
  }

  async gotoAddUser(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/web/index.php/admin/saveSystemUser`, {
      timeout: TIMEOUTS.navigation,
    });
    await this.page.waitForSelector(ADMIN_SELECTORS.form.heading, { timeout: TIMEOUTS.navigation });
  }

  // ─── Search form (list page) ───────────────────────────────────────────────

  async searchByUsername(username: string): Promise<void> {
    /** Username field is nth(1) globally — nth(0) is the sidebar search */
    await this.page.getByRole('textbox').nth(1).fill(username);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchByStatus(status: UserStatus): Promise<void> {
    /** Status is the 2nd .oxd-select-wrapper on the search form (User Role is 1st) */
    await this.page.locator('.oxd-select-wrapper').nth(1).click();
    await this.page.getByRole('option', { name: status }).click();
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getRecordsCountText(): Promise<string> {
    return this.page.locator(ADMIN_SELECTORS.list.recordsCount).innerText();
  }

  async getTableRowCount(): Promise<number> {
    return this.page.locator(ADMIN_SELECTORS.list.tableRows).count();
  }

  async getStatusCellTexts(): Promise<string[]> {
    return this.page.locator(ADMIN_SELECTORS.list.statusCells).allInnerTexts();
  }

  // ─── Add User form ─────────────────────────────────────────────────────────

  async selectUserRole(role: UserRole): Promise<void> {
    await this.formCard.locator('.oxd-select-wrapper').nth(0).click();
    await this.page.getByRole('option', { name: role }).click();
  }

  async fillEmployeeName(namePrefix: string): Promise<void> {
    await this.page.locator(ADMIN_SELECTORS.form.employeeNameInput).fill(namePrefix);
    await this.page.waitForSelector(ADMIN_SELECTORS.form.employeeDropdownOption, {
      timeout: TIMEOUTS.default,
    });
    await this.page.locator(ADMIN_SELECTORS.form.employeeDropdownOption).first().click();
  }

  async selectStatus(status: UserStatus): Promise<void> {
    await this.formCard.locator('.oxd-select-wrapper').nth(1).click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async fillUsernameField(username: string): Promise<void> {
    /** Username is the only non-placeholder, non-password input inside the card */
    await this.formCard
      .locator('input:not([placeholder]):not([type="password"])')
      .fill(username);
  }

  async fillPasswordField(password: string): Promise<void> {
    await this.page.locator('input[type="password"]').nth(0).fill(password);
  }

  async fillConfirmPasswordField(password: string): Promise<void> {
    await this.page.locator('input[type="password"]').nth(1).fill(password);
  }

  async clickSave(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  // ─── Result helpers ────────────────────────────────────────────────────────

  async getFieldErrors(): Promise<string[]> {
    await this.page.waitForSelector(ADMIN_SELECTORS.fieldError, { timeout: TIMEOUTS.default });
    return this.page.locator(ADMIN_SELECTORS.fieldError).allInnerTexts();
  }

  async getPasswordStrengthText(): Promise<string> {
    const el = this.page.locator(ADMIN_SELECTORS.form.passwordStrength);
    if ((await el.count()) === 0) {return '';}
    return el.innerText();
  }
}
