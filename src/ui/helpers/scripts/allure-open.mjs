/**
 * Opens Allure report. Generates from allure-results if allure-report doesn't exist.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const ALLURE_REPORT = path.join(ROOT, 'allure-report/unified');
const ALLURE_RESULTS_BDD = path.join(ROOT, 'allure-report/results/bdd');
const ALLURE_RESULTS_TDD = path.join(ROOT, 'allure-report/results/tdd');
const ALLURE_RESULTS_API = path.join(ROOT, 'allure-report/results/api-raw');

const hasBddResults = fs.existsSync(ALLURE_RESULTS_BDD) && fs.readdirSync(ALLURE_RESULTS_BDD).length > 0;
const hasTddResults = fs.existsSync(ALLURE_RESULTS_TDD) && fs.readdirSync(ALLURE_RESULTS_TDD).length > 0;
const hasApiResults = fs.existsSync(ALLURE_RESULTS_API) && fs.readdirSync(ALLURE_RESULTS_API).length > 0;
const hasReport = fs.existsSync(ALLURE_REPORT) && fs.readdirSync(ALLURE_REPORT).length > 0;

if (!hasReport && !hasBddResults && !hasTddResults && !hasApiResults) {
  console.error('Error: No Allure results found.');
  console.error('  Run tests first: npm run test:bdd and/or npm run test:tdd and/or npm run test:api');
  process.exit(1);
}

if (!hasReport && (hasBddResults || hasTddResults || hasApiResults)) {
  console.log('Generating Allure report...');
  execSync('npm run allure:generate', { cwd: ROOT, stdio: 'inherit' });
}

execSync('npx allure open allure-report/unified', { cwd: ROOT, stdio: 'inherit' });
