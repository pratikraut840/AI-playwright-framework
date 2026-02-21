import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { loginTestData } from '../../tests/data/login';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Custom assertions for Login / Dashboard.
 * Use in step definitions; keep expect() calls here.
 */
export async function assertRedirectedToDashboard(page: Page): Promise<void> {
  await expect(page).toHaveURL(new RegExp(loginTestData.dashboardPath));
}

export async function assertDashboardHeaderVisible(page: Page): Promise<void> {
  const dashboardPage = new DashboardPage(page);
  const header = await dashboardPage.getHeaderLocator();
  await expect(header).toBeVisible({ timeout: 10000 });
}
