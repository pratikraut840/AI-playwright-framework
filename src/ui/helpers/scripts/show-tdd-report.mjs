/**
 * Opens TDD (Playwright) report. Uses playwright-report-tdd.html only;
 * converts index.html to playwright-report-tdd.html and removes index.html to avoid duplication.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const REPORT_DIR = path.join(ROOT, 'playwright-report', 'playwright-report-tdd');
const INDEX_HTML = path.join(REPORT_DIR, 'index.html');
const TDD_REPORT_HTML = path.join(REPORT_DIR, 'playwright-report-tdd.html');

const hasIndex = fs.existsSync(INDEX_HTML);
const hasTddReport = fs.existsSync(TDD_REPORT_HTML);

if (!hasIndex && !hasTddReport) {
  console.error('Error: Playwright report not found.');
  console.error('  Expected: playwright-report/playwright-report-tdd/playwright-report-tdd.html');
  console.error('  Run TDD tests first: npm run test:tdd');
  process.exit(1);
}

// If Playwright just generated index.html, copy to playwright-report-tdd.html and remove index.html
if (hasIndex) {
  fs.copyFileSync(INDEX_HTML, TDD_REPORT_HTML);
  fs.unlinkSync(INDEX_HTML);
}

function openInBrowser(filePath) {
  const url = 'file:///' + filePath.replace(/\\/g, '/').replace(/^([A-Za-z]):/, '$1:');
  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${url}"`, { stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      execSync(`open "${url}"`, { stdio: 'ignore' });
    } else {
      execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
    }
    return true;
  } catch {
    return false;
  }
}

// Open playwright-report-tdd.html directly (index.html removed to avoid duplication)
if (openInBrowser(TDD_REPORT_HTML)) {
  console.log('Opened report in browser.');
} else {
  console.error('Open manually:', TDD_REPORT_HTML);
  process.exit(1);
}
