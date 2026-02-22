/**
 * Converts Cucumber JSON report to JUnit XML for CI.
 * @ts-check
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * @typedef {{ status?: string; duration?: number; error_message?: string }} StepResult
 * @typedef {{ result?: StepResult }} Step
 * @typedef {{ name: string; steps: Step[] }} Scenario
 * @typedef {{ name: string; elements?: Scenario[] }} Feature
 * @typedef {Feature[]} CucumberReport
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT_PATH = path.join(__dirname, 'test-results', 'cucumber-json', 'cucumber-report.json');
const OUTPUT_PATH = path.join(__dirname, 'test-results', 'junit-report', 'junit-report.xml');

if (!fs.existsSync(INPUT_PATH)) {
  console.error('Error: cucumber-report.json not found at test-results/. Run tests first.');
  process.exit(1);
}

const RESULTS = /** @type {CucumberReport} */ (JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8')));

/**
 * Escapes a string for safe use in XML text/attributes.
 * @param {string} str - Raw string.
 * @returns {string} XML-escaped string.
 */
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Builds JUnit XML string from Cucumber report.
 * @param {CucumberReport} features - Parsed Cucumber JSON.
 * @returns {string} JUnit XML document string.
 */
function buildJUnit(features) {
  const suites = features.map((feature) => {
    const scenarios = feature.elements || [];
    const tests = scenarios.length;
    const failures = scenarios.filter((s) =>
      s.steps.some((step) => step.result?.status === 'failed')
    ).length;
    const skipped = scenarios.filter((s) =>
      s.steps.some((step) => step.result?.status === 'skipped')
    ).length;
    const totalDuration = scenarios.reduce((acc, s) => {
      return acc + s.steps.reduce((a, step) => a + (step.result?.duration ?? 0), 0);
    }, 0);

    const testCases = scenarios.map((scenario) => {
      const failed = scenario.steps.find((s) => s.result?.status === 'failed');
      const isSkipped = scenario.steps.every(
        (s) => s.result?.status === 'skipped' || s.result?.status === 'pending'
      );
      const duration = scenario.steps.reduce(
        (acc, s) => acc + (s.result?.duration ?? 0),
        0
      );

      let inner = '';
      if (failed) {
        inner = `<failure message="${escapeXml(failed.result?.error_message || 'Step failed')}">${escapeXml(failed.result?.error_message || '')}</failure>`;
      } else if (isSkipped) {
        inner = '<skipped/>';
      }

      return `    <testcase name="${escapeXml(scenario.name)}" classname="${escapeXml(feature.name)}" time="${(duration / 1e9).toFixed(3)}">${inner}</testcase>`;
    });

    return `  <testsuite name="${escapeXml(feature.name)}" tests="${tests}" failures="${failures}" skipped="${skipped}" time="${(totalDuration / 1e9).toFixed(3)}">\n${testCases.join('\n')}\n  </testsuite>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<testsuites>\n${suites.join('\n')}\n</testsuites>`;
}

const xml = buildJUnit(RESULTS);
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, xml, 'utf-8');
console.log(`JUnit XML report written to: ${OUTPUT_PATH}`);
