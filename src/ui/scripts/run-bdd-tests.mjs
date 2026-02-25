/**
 * Runs BDD (Cucumber) tests. Clears result dirs BEFORE starting cucumber
 * so formatters can create outputs without conflict (clearing in BeforeAll
 * would delete files after formatters open them).
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const BDD_DIRS = [
  'test-results/test-results-bdd',
  'test-results/test-results-bdd/cucumber-json',
  'test-results/test-results-bdd/cucumber-html-report',
  'allure-report/results/bdd',
];

for (const dir of BDD_DIRS) {
  const resolved = path.resolve(ROOT, dir);
  try {
    if (fs.existsSync(resolved)) fs.rmSync(resolved, { recursive: true });
    fs.mkdirSync(resolved, { recursive: true });
  } catch (err) {
    if (err?.code === 'EPERM' || err?.code === 'EBUSY') {
      console.warn(`[run-bdd] Could not clear ${dir} (file in use). Continuing.`);
      fs.mkdirSync(resolved, { recursive: true });
    } else throw err;
  }
}

// Run without --config: config format fails to write files; use shell so format/output works
const JSON_PATH = 'test-results/test-results-bdd/cucumber-json/cucumber-report-bdd.json';
const HTML_PATH = 'test-results/test-results-bdd/cucumber-html-report/cucumber-html-report.html';

// Use shell so formatter output is written (array-based execSync can fail on Windows)
// progress-bar with green bar via preload patch; FORCE_COLOR for other output
const patchPath = path.resolve(ROOT, 'src/ui/scripts/green-progress-patch.cjs').replace(/\\/g, '/');
const nodeOpts = [process.env.NODE_OPTIONS || '', `--require ${JSON.stringify(patchPath)}`].filter(Boolean).join(' ');
const cmd = `npx cucumber-js --format progress-bar --format "json:${JSON_PATH}" --format "html:${HTML_PATH}" --require-module ts-node/register --require "src/ui/helpers/hooks/hooks.ts" --require "src/ui/stepDefinitions/**/*.steps.ts" ${process.argv.slice(2).join(' ')} "src/ui/tests/features/**/*.feature"`;
try {
  execSync(cmd, {
    stdio: 'inherit',
    cwd: ROOT,
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1', NODE_OPTIONS: nodeOpts },
  });
} catch (err) {
  process.exit(err?.status ?? err?.code ?? 1);
}
