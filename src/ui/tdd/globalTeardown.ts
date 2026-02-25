/**
 * TDD Global Teardown – copies .last-run.json to test-results/test-results-bdd;
 * converts index.html to playwright-report-tdd.html and removes index.html.
 */
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = 'test-results/test-results-tdd';
const TARGET_DIR = 'test-results/test-results-bdd';
const LAST_RUN_FILE = '.last-run.json';
const REPORT_DIR = 'playwright-report/playwright-report-tdd';
const INDEX_HTML = path.join(REPORT_DIR, 'index.html');
const TDD_REPORT_HTML = path.join(REPORT_DIR, 'playwright-report-tdd.html');

function globalTeardown(): void {
  const root = process.cwd();

  // Convert index.html → playwright-report-tdd.html and remove index.html
  const indexPath = path.join(root, INDEX_HTML);
  const tddReportPath = path.join(root, TDD_REPORT_HTML);
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, tddReportPath);
    fs.unlinkSync(indexPath);
  }
  const possibleSources = [
    path.join(root, OUTPUT_DIR, LAST_RUN_FILE),
    path.join(root, REPORT_DIR, LAST_RUN_FILE),
    path.join(root, LAST_RUN_FILE),
  ];

  for (const src of possibleSources) {
    if (fs.existsSync(src)) {
      const targetDir = path.join(root, TARGET_DIR);
      const target = path.join(targetDir, LAST_RUN_FILE);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.copyFileSync(src, target);
      break;
    }
  }
}

export default globalTeardown;
