import * as fs from 'fs';
import { execSync } from 'child_process';
import * as reporter from 'multiple-cucumber-html-reporter';
import {
  clearCucumberReportDir,
  clearDirectory,
} from './clearReportDirs';

const ALLURE_RESULTS_BDD = 'allure-results-bdd';
const ALLURE_RESULTS_TDD = 'allure-results-tdd';
const ALLURE_REPORT = 'allure-report';

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

function generateCucumberReport(): void {
  clearCucumberReportDir();
  reporter.generate({
    jsonDir: 'test-results/cucumber-json',
    reportPath: 'test-results/cucumber-html-report',
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
}

const cmd = process.argv[2];
if (cmd === 'allure:generate') {
  runAllureGenerate();
} else if (cmd === 'allure:serve') {
  runAllureServe();
} else {
  generateCucumberReport();
}
