import type { Locator, Page } from '@playwright/test';
import { DASHBOARD_SELECTORS } from '../constants/selectors/login.selectors';

/**
 * Page Object for OrangeHRM Dashboard (post-login).
 * Encapsulates UI actions and locators; assertions go in loginAssertions.
 */
export class DashboardPage {
  public constructor(private readonly page: Page) {}

  public async getHeaderLocator(): Promise<Locator> {
    return this.page.locator(DASHBOARD_SELECTORS.header).first();
  }

  public async getDashboardHeadingLocator(): Promise<Locator> {
    return this.page.locator(DASHBOARD_SELECTORS.dashboardHeading).first();
  }
}
