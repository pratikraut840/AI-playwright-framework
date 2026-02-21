import type { Page } from '@playwright/test';
import { loginSelectors } from '../constants/selectors/login.selectors';

/**
 * Page Object for OrangeHRM Login page.
 * Encapsulates UI actions only; no assertions.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/web/index.php/auth/login`);
  }

  async fillUsername(username: string): Promise<void> {
    await this.page.locator(loginSelectors.usernameInput).fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.locator(loginSelectors.passwordInput).fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.page.locator(loginSelectors.loginButton).click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}
