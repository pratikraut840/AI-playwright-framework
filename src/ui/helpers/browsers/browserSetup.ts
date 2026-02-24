import { chromium, firefox, webkit } from '@playwright/test';
import type { Browser, LaunchOptions } from '@playwright/test';

export type SupportedBrowser = 'chromium' | 'firefox' | 'webkit';

const BROWSER_MAP: Record<SupportedBrowser, typeof chromium> = { chromium, firefox, webkit };

/**
 * Launches a browser based on the BROWSER environment variable.
 * Defaults to chromium if not set.
 * Set via: cross-env BROWSER=firefox (see package.json scripts)
 */
const STABLE_LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
];

export async function launchBrowser(options?: LaunchOptions): Promise<Browser> {
  const browserName = (process.env.BROWSER ?? 'chromium') as SupportedBrowser;
  if (!(browserName in BROWSER_MAP)) {
    throw new Error(
      `Unsupported browser: "${browserName}". Valid options: chromium, firefox, webkit.`
    );
  }
  const merged: LaunchOptions = {
    ...options,
    args: [...STABLE_LAUNCH_ARGS, ...(options?.args ?? [])],
  };
  return BROWSER_MAP[browserName].launch(merged);
}
