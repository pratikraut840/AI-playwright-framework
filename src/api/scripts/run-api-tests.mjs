/**
 * Runs API tests, then converts index.html to playwright-report-api.html.
 * Conversion runs even when tests fail (report is still generated).
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

let exitCode = 0;
try {
  execSync('playwright test --config=playwright.api.config.ts', {
    stdio: 'inherit',
    cwd: ROOT,
    env: { ...process.env, FORCE_COLOR: '1' },
  });
} catch (e) {
  exitCode = e.status ?? 1;
}

// Convert index.html → playwright-report-api.html (report exists even on failure)
const REPORT_DIR = path.join(ROOT, 'playwright-report', 'playwright-report-api');
const INDEX_HTML = path.join(REPORT_DIR, 'index.html');
const API_REPORT_HTML = path.join(REPORT_DIR, 'playwright-report-api.html');
if (fs.existsSync(INDEX_HTML)) {
  fs.copyFileSync(INDEX_HTML, API_REPORT_HTML);
  fs.unlinkSync(INDEX_HTML);
}

process.exit(exitCode);
