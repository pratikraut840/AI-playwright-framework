import type { Page } from '@playwright/test';
import { dashboardSelectors } from '../constants/selectors/login.selectors';

/**
 * Page Object for OrangeHRM Dashboard (post-login).
 * Encapsulates UI actions and locators; assertions go in loginAssertions.
 */
export class DashboardPage {
  constructor(private readonly page: Page) {}

  async getHeaderLocator() {
    return this.page.locator(dashboardSelectors.header).first();
  }

  async getDashboardHeadingLocator() {
    return this.page.locator(dashboardSelectors.dashboardHeading).first();
  }
}
