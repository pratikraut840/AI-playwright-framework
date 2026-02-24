/**
 * Opens TDD (Playwright) report. Tries playwright show-report first;
 * on port conflict, opens index.html directly.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'playwright-report');
const INDEX_HTML = path.join(REPORT_DIR, 'index.html');

if (!fs.existsSync(INDEX_HTML)) {
  console.error('Error: Playwright report not found.');
  console.error('  Expected: playwright-report/index.html');
  console.error('  Run TDD tests first: npm run test:tdd');
  process.exit(1);
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

try {
  execSync('npx playwright show-report playwright-report', {
    cwd: ROOT,
    stdio: 'inherit',
  });
} catch (err) {
  console.log('\nReport server failed. Opening report file directly...');
  if (openInBrowser(INDEX_HTML)) {
    console.log('Opened in browser.');
  } else {
    console.error('Open manually:', INDEX_HTML);
    process.exit(1);
  }
}
