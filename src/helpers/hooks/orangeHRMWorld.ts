import type { IWorldOptions } from '@cucumber/cucumber';
import { World } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';

/**
 * Custom Cucumber World for OrangeHRM framework.
 * Provides shared browser, context, and page objects across all step definitions.
 * Instantiated fresh for each scenario by the Cucumber runner.
 */
export class OrangeHRMWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}
