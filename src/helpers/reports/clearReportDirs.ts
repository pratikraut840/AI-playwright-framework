/**
 * Clears test result and report directories before a fresh run or report generation.
 * Prevents stale data from mixing with new results.
 */
import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively clears a directory (removes all contents) and recreates it empty.
 * If the directory doesn't exist, creates it.
 */
export function clearDirectory(dirPath: string): void {
  const resolved = path.resolve(dirPath);
  if (fs.existsSync(resolved)) {
    fs.rmSync(resolved, { recursive: true });
  }
  fs.mkdirSync(resolved, { recursive: true });
}

/** BDD (Cucumber) result dirs — clear before BDD test run for fresh results */
export const BDD_RESULT_DIRS = ['test-results', 'allure-results-bdd'] as const;

/** TDD (Playwright) result dirs — clear before TDD test run (test-results excluded to preserve BDD data when running test:all) */
export const TDD_RESULT_DIRS = ['playwright-report', 'allure-results-tdd'] as const;

/** Clears all BDD result directories (call before BDD test run) */
export function clearBddResultDirs(): void {
  for (const dir of BDD_RESULT_DIRS) {
    clearDirectory(dir);
  }
}

/** Clears all TDD result directories (call before TDD test run) */
export function clearTddResultDirs(): void {
  for (const dir of TDD_RESULT_DIRS) {
    clearDirectory(dir);
  }
}

/** Clears Cucumber HTML report dir before generating new report (output only; json dir is input) */
export function clearCucumberReportDir(): void {
  clearDirectory('test-results/cucumber-html-report');
}

/** Clears JUnit report dir before generating new BDD JUnit report */
export function clearJunitReportDir(): void {
  clearDirectory('test-results/junit-report');
}

/** Clears root test-results folder (all subdirs: cucumber-json, cucumber-html-report, junit-report, Playwright artifacts) */
export function clearTestResultsDir(): void {
  clearDirectory('test-results');
}
