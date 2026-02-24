import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as reporter from 'multiple-cucumber-html-reporter';
import {
  clearCucumberReportDir,
  clearDirectory,
} from './clearReportDirs';

const ALLURE_RESULTS_BDD = 'allure-results-bdd';
const ALLURE_RESULTS_TDD = 'allure-results-tdd';
const ALLURE_REPORT = 'allure-report';
const CUCUMBER_JSON_DIR = 'test-results/cucumber-json';
const CUCUMBER_HTML_DIR = 'test-results/cucumber-html-report';
const CUCUMBER_INDEX = path.join(CUCUMBER_HTML_DIR, 'index.html');

function ensureAllureDirs(): void {
  fs.mkdirSync(ALLURE_RESULTS_BDD, { recursive: true });
  fs.mkdirSync(ALLURE_RESULTS_TDD, { recursive: true });
}

function runAllureGenerate(): void {
  ensureAllureDirs();
  clearDirectory(ALLURE_REPORT);
  execSync(
    `npx allure generate ${ALLURE_RESULTS_BDD} ${ALLURE_RESULTS_TDD} -o ${ALLURE_REPORT} --clean`,
    { stdio: 'inherit' }
  );
}

function runAllureServe(): void {
  ensureAllureDirs();
  execSync(`npx allure serve ${ALLURE_RESULTS_BDD} ${ALLURE_RESULTS_TDD}`, {
    stdio: 'inherit',
  });
}

function hasValidCucumberJson(): boolean {
  const jsonDir = path.resolve(CUCUMBER_JSON_DIR);
  if (!fs.existsSync(jsonDir)) return false;
  const files = fs.readdirSync(jsonDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) return false;
  const mainFile = path.join(jsonDir, 'cucumber-report.json');
  if (!fs.existsSync(mainFile)) return false;
  try {
    const raw = fs.readFileSync(mainFile, 'utf-8').trim();
    const data = JSON.parse(raw || '[]');
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

function openInBrowser(filePath: string): void {
  const resolved = path.resolve(filePath);
  const url = 'file:///' + resolved.replace(/\\/g, '/').replace(/^([A-Za-z]):/, '$1:');
  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${url}"`, { stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      execSync(`open "${url}"`, { stdio: 'ignore' });
    } else {
      execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
    }
    console.log('Opened report in browser.');
  } catch (err) {
    console.warn('Could not open browser. Report saved at:', resolved);
  }
}

function generateCucumberReport(): void {
  if (!hasValidCucumberJson()) {
    console.error('Error: No BDD test results found.');
    console.error('  Expected: test-results/cucumber-json/cucumber-report.json');
    console.error('  Run BDD tests first: npm run test:bdd');
    process.exit(1);
  }
  clearCucumberReportDir();
  reporter.generate({
    jsonDir: CUCUMBER_JSON_DIR,
    reportPath: CUCUMBER_HTML_DIR,
    displayDuration: true,
    metadata: {
      browser: {
        name: process.env.BROWSER ?? 'chromium',
        version: 'latest',
      },
      device: 'Local machine',
      platform: {
        name: process.platform,
        version: '',
      },
    },
    customData: {
      title: 'OrangeHRM Automation — Test Run Info',
      data: [
        { label: 'Project', value: 'OrangeHRM Automation' },
        { label: 'Environment', value: process.env.NODE_ENV ?? 'dev' },
        { label: 'Executed', value: new Date().toLocaleString() },
      ],
    },
  });
  openInBrowser(CUCUMBER_INDEX);
}

const cmd = process.argv[2];
if (cmd === 'allure:generate') {
  runAllureGenerate();
} else if (cmd === 'allure:serve') {
  runAllureServe();
} else {
  generateCucumberReport();
}
