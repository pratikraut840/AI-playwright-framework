import { Before, After, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import * as dotenv from 'dotenv';
import { OrangeHRMWorld } from './orangeHRMWorld';
import { launchBrowser } from '../browsers/browserSetup';

// Load environment-specific .env file first, then fall back to base .env
const ENV_NAME = process.env.NODE_ENV ?? 'dev';
dotenv.config({ path: `src/helpers/env/.env.${ENV_NAME}` });
dotenv.config({ path: 'src/helpers/env/.env' });

setWorldConstructor(OrangeHRMWorld);
setDefaultTimeout(120 * 1000);

Before(async function (this: OrangeHRMWorld) {
  this.browser = await launchBrowser({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: OrangeHRMWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
