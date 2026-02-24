import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as reporter from 'multiple-cucumber-html-reporter';
import {
  clearCucumberReportDir,
  clearDirectory,
} from './clearReportDirs';
import { writeAllureMetadata } from './allureMetadata';

const ALLURE_RESULTS_BDD = 'allure-results-bdd';
const ALLURE_RESULTS_TDD = 'allure-results-tdd';
const ALLURE_RESULTS_API = 'allure-results-api';
const ALLURE_REPORT = 'allure-report';
const CUCUMBER_JSON_DIR = 'test-results-bdd/cucumber-json';
const CUCUMBER_HTML_DIR = 'test-results-bdd/cucumber-html-report';
const CUCUMBER_HTML_FILE = 'cucumber-html-report.html';
const CUCUMBER_INDEX = path.join(CUCUMBER_HTML_DIR, CUCUMBER_HTML_FILE);

function ensureAllureDirs(): void {
  fs.mkdirSync(ALLURE_RESULTS_BDD, { recursive: true });
  fs.mkdirSync(ALLURE_RESULTS_TDD, { recursive: true });
  fs.mkdirSync(ALLURE_RESULTS_API, { recursive: true });
}

function preserveAllureHistory(): void {
  const historySrc = path.join(ALLURE_REPORT, 'history');
  if (fs.existsSync(historySrc)) {
    [ALLURE_RESULTS_BDD, ALLURE_RESULTS_TDD, ALLURE_RESULTS_API].forEach((dir) => {
      const historyDst = path.join(dir, 'history');
      fs.mkdirSync(dir, { recursive: true });
      try {
        if (fs.existsSync(historyDst)) fs.rmSync(historyDst, { recursive: true });
        fs.cpSync(historySrc, historyDst, { recursive: true });
      } catch {
        // Ignore copy errors (e.g. dir in use)
      }
    });
  }
}

function runAllureGenerate(): void {
  ensureAllureDirs();
  preserveAllureHistory();
  writeAllureMetadata(ALLURE_RESULTS_BDD, 'bdd');
  writeAllureMetadata(ALLURE_RESULTS_TDD, 'tdd');
  writeAllureMetadata(ALLURE_RESULTS_API, 'api');
  clearDirectory(ALLURE_REPORT);
  execSync(
    `npx allure generate ${ALLURE_RESULTS_BDD} ${ALLURE_RESULTS_TDD} ${ALLURE_RESULTS_API} -o ${ALLURE_REPORT} --clean`,
    { stdio: 'inherit' }
  );
}

function runAllureServe(): void {
  ensureAllureDirs();
  writeAllureMetadata(ALLURE_RESULTS_BDD, 'bdd');
  writeAllureMetadata(ALLURE_RESULTS_TDD, 'tdd');
  writeAllureMetadata(ALLURE_RESULTS_API, 'api');
  execSync(`npx allure serve ${ALLURE_RESULTS_BDD} ${ALLURE_RESULTS_TDD} ${ALLURE_RESULTS_API}`, {
    stdio: 'inherit',
  });
}

function hasValidCucumberJson(): boolean {
  const jsonDir = path.resolve(CUCUMBER_JSON_DIR);
  if (!fs.existsSync(jsonDir)) return false;
  const files = fs.readdirSync(jsonDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) return false;
  const mainFile = path.join(jsonDir, 'cucumber-report-bdd.json');
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
    console.error('  Expected: test-results-bdd/cucumber-json/cucumber-report-bdd.json');
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
  // Copy index.html to cucumber-html-report.html, remove index.html (reporter always creates index.html)
  const indexPath = path.join(CUCUMBER_HTML_DIR, 'index.html');
  if (fs.existsSync(path.resolve(indexPath))) {
    fs.copyFileSync(path.resolve(indexPath), path.resolve(CUCUMBER_INDEX));
    fs.unlinkSync(path.resolve(indexPath));
  }
  openInBrowser(CUCUMBER_INDEX);
}

function preserveAllureApiHistory(): void {
  const ALLURE_REPORT_API = 'allure-report-api';
  const historySrc = path.join(ALLURE_REPORT_API, 'history');
  if (fs.existsSync(historySrc)) {
    fs.mkdirSync(ALLURE_RESULTS_API, { recursive: true });
    const historyDst = path.join(ALLURE_RESULTS_API, 'history');
    try {
      if (fs.existsSync(historyDst)) fs.rmSync(historyDst, { recursive: true });
      fs.cpSync(historySrc, historyDst, { recursive: true });
    } catch {
      // Ignore
    }
  }
}

function runAllureApiGenerate(): void {
  ensureAllureDirs();
  preserveAllureApiHistory();
  writeAllureMetadata(ALLURE_RESULTS_API, 'api');
  const ALLURE_REPORT_API = 'allure-report-api';
  execSync(
    `npx allure generate ${ALLURE_RESULTS_API} -o ${ALLURE_REPORT_API} --clean`,
    { stdio: 'inherit' }
  );
}

function runAllureApiServe(): void {
  ensureAllureDirs();
  writeAllureMetadata(ALLURE_RESULTS_API, 'api');
  execSync(`npx allure serve ${ALLURE_RESULTS_API}`, { stdio: 'inherit' });
}

const cmd = process.argv[2];
if (cmd === 'allure:generate') {
  runAllureGenerate();
} else if (cmd === 'allure:serve') {
  runAllureServe();
} else if (cmd === 'allure:api:generate') {
  runAllureApiGenerate();
} else if (cmd === 'allure:api:serve') {
  runAllureApiServe();
} else {
  generateCucumberReport();
}
