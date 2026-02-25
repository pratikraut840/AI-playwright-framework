import type { Page } from '@playwright/test';
import { LOGIN_SELECTORS } from '../constants/selectors/login.selectors';
import { TIMEOUTS } from '../constants/global';

/**
 * Page Object for OrangeHRM Login page.
 * Encapsulates UI actions only; no assertions.
 */
export class LoginPage {
  public constructor(private readonly page: Page) {}

  public async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/web/index.php/auth/login`, {
      timeout: 90_000,
      waitUntil: 'commit',
    });
  }

  public async fillUsername(username: string): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.usernameInput).fill(username);
  }

  public async fillPassword(password: string): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.passwordInput).fill(password);
  }

  public async clickLogin(): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.loginButton).click({
      timeout: 90_000,
    });
  }

  public async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  public async getAlertMessage(): Promise<string> {
    return this.page.locator(LOGIN_SELECTORS.alertMessage).innerText();
  }

  public async getUsernameFieldError(): Promise<string> {
    return this.page.locator(LOGIN_SELECTORS.fieldErrorMessage).nth(0).innerText();
  }

  public async getPasswordFieldError(): Promise<string> {
    return this.page.locator(LOGIN_SELECTORS.fieldErrorMessage).nth(1).innerText();
  }
}
