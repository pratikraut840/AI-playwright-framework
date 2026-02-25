import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as reporter from 'multiple-cucumber-html-reporter';
import {
  clearCucumberReportDir,
  clearDirectory,
} from './clearReportDirs';
import { writeAllureMetadata } from './allureMetadata';

const ALLURE_BASE = 'allure-report';
const ALLURE_RESULTS_BDD = `${ALLURE_BASE}/results/bdd`;
const ALLURE_RESULTS_TDD = `${ALLURE_BASE}/results/tdd`;
const ALLURE_RESULTS_API = `${ALLURE_BASE}/results/api-raw`;
const ALLURE_REPORT = `${ALLURE_BASE}/unified`;
const ALLURE_REPORT_API = `${ALLURE_BASE}/api`;
const CUCUMBER_JSON_DIR = 'test-results/test-results-bdd/cucumber-json';
const CUCUMBER_HTML_DIR = 'test-results/test-results-bdd/cucumber-html-report';
const CUCUMBER_HTML_FILE = 'cucumber-html-report.html';
const CUCUMBER_INDEX = path.join(CUCUMBER_HTML_DIR, CUCUMBER_HTML_FILE);

/** Returns dirs that contain at least one *-result.json (Allure test result file). */
function getAvailableAllureResultDirs(): string[] {
  const allDirs = [ALLURE_RESULTS_BDD, ALLURE_RESULTS_TDD, ALLURE_RESULTS_API];
  return allDirs.filter((dir) => {
    const resolved = path.resolve(dir);
    if (!fs.existsSync(resolved)) return false;
    const files = fs.readdirSync(resolved);
    return files.some((f) => f.endsWith('-result.json'));
  });
}

function ensureAllureDirs(): void {
  fs.mkdirSync(ALLURE_RESULTS_BDD, { recursive: true });
  fs.mkdirSync(ALLURE_RESULTS_TDD, { recursive: true });
  fs.mkdirSync(ALLURE_RESULTS_API, { recursive: true });
}

function preserveAllureHistory(dirs: string[]): void {
  const historySrc = path.join(ALLURE_REPORT, 'history');
  if (fs.existsSync(historySrc)) {
    dirs.forEach((dir) => {
      const historyDst = path.join(dir, 'history');
      fs.mkdirSync(dir, { recursive: true });
      try {
        if (fs.existsSync(historyDst)) {fs.rmSync(historyDst, { recursive: true });}
        fs.cpSync(historySrc, historyDst, { recursive: true });
      } catch {
        // Ignore copy errors (e.g. dir in use)
      }
    });
  }
}

function runAllureGenerate(): void {
  const availableDirs = getAvailableAllureResultDirs();
  if (availableDirs.length === 0) {
    console.error('No Allure results found. Run test:bdd, test:tdd, and/or test:api first.');
    console.error('  Expected result files in: allure-report/results/{bdd,tdd,api-raw}');
    process.exit(1);
  }
  ensureAllureDirs();
  preserveAllureHistory(availableDirs);
  availableDirs.forEach((dir) => {
    const layer = dir.includes('/bdd') ? 'bdd' : dir.includes('/tdd') ? 'tdd' : 'api';
    writeAllureMetadata(dir, layer);
  });
  clearDirectory(ALLURE_REPORT);
  const dirsArg = availableDirs.join(' ');
  execSync(`npx allure generate ${dirsArg} -o ${ALLURE_REPORT} --clean`, { stdio: 'inherit' });
}

function runAllureServe(): void {
  const availableDirs = getAvailableAllureResultDirs();
  if (availableDirs.length === 0) {
    console.error('No Allure results found. Run test:bdd, test:tdd, and/or test:api first.');
    console.error('  Expected result files in: allure-report/results/{bdd,tdd,api-raw}');
    process.exit(1);
  }
  ensureAllureDirs();
  availableDirs.forEach((dir) => {
    const layer = dir.includes('/bdd') ? 'bdd' : dir.includes('/tdd') ? 'tdd' : 'api';
    writeAllureMetadata(dir, layer);
  });
  const dirsArg = availableDirs.join(' ');
  execSync(`npx allure serve ${dirsArg}`, { stdio: 'inherit' });
}

function hasValidCucumberJson(): boolean {
  const jsonDir = path.resolve(CUCUMBER_JSON_DIR);
  if (!fs.existsSync(jsonDir)) {return false;}
  const files = fs.readdirSync(jsonDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {return false;}
  const mainFile = path.join(jsonDir, 'cucumber-report-bdd.json');
  if (!fs.existsSync(mainFile)) {return false;}
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

function hasCucumberHtmlReport(): boolean {
  const htmlPath = path.resolve(CUCUMBER_INDEX);
  if (!fs.existsSync(htmlPath)) {return false;}
  return fs.statSync(htmlPath).size > 0;
}

function generateCucumberReport(): void {
  if (!hasValidCucumberJson()) {
    // Fallback: open Cucumber's built-in HTML report if JSON is empty
    if (hasCucumberHtmlReport()) {
      console.warn('Note: JSON report empty; opening Cucumber HTML report instead.');
      openInBrowser(CUCUMBER_INDEX);
      return;
    }
    // Run BDD tests first if no results (Cucumber formatters may not write on Node 24)
    console.warn('No BDD results found. Running test:bdd first...');
    try {
      execSync('npm run test:bdd', { stdio: 'inherit', cwd: process.cwd() });
    } catch {
      console.error('test:bdd failed. Cannot generate report.');
      process.exit(1);
    }
    if (!hasValidCucumberJson() && !hasCucumberHtmlReport()) {
      console.error('Error: BDD tests ran but no report output was generated.');
      console.error('  This can happen with Node 24. Try Node 20 or 22.');
      console.error('  Expected: test-results/test-results-bdd/cucumber-json/cucumber-report-bdd.json');
      console.error('  Or: test-results/test-results-bdd/cucumber-html-report/cucumber-html-report.html');
      process.exit(1);
    }
    if (hasCucumberHtmlReport() && !hasValidCucumberJson()) {
      openInBrowser(CUCUMBER_INDEX);
      return;
    }
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
  const historySrc = path.join(ALLURE_REPORT_API, 'history');
  if (fs.existsSync(historySrc)) {
    fs.mkdirSync(ALLURE_RESULTS_API, { recursive: true });
    const historyDst = path.join(ALLURE_RESULTS_API, 'history');
    try {
      if (fs.existsSync(historyDst)) {fs.rmSync(historyDst, { recursive: true });}
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
