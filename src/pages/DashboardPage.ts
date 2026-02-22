import type { Locator, Page } from '@playwright/test';
import { DASHBOARD_SELECTORS } from '../constants/selectors/login.selectors';

/**
 * Page Object for OrangeHRM Dashboard (post-login).
 * Encapsulates UI actions and locators; assertions go in loginAssertions.
 */
export class DashboardPage {
  constructor(private readonly page: Page) {}

  async getHeaderLocator(): Promise<Locator> {
    return this.page.locator(DASHBOARD_SELECTORS.header).first();
  }

  async getDashboardHeadingLocator(): Promise<Locator> {
    return this.page.locator(DASHBOARD_SELECTORS.dashboardHeading).first();
  }
}
