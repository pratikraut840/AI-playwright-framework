/**
 * Runs BDD (Cucumber) tests. Clears result dirs BEFORE starting cucumber
 * so formatters can create outputs without conflict (clearing in BeforeAll
 * would delete files after formatters open them).
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const BDD_DIRS = ['test-results/test-results-bdd', 'allure-report/results/bdd'];

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

// Pass through extra args (e.g. --tags @smoke, --profile progress)
const extraArgs = process.argv.slice(2).join(' ');
const cmd = `npx cucumber-js --config cucumber.mjs --format json:test-results/test-results-bdd/cucumber-json/cucumber-report-bdd.json ${extraArgs}`.trim();
execSync(cmd, {
  stdio: 'inherit',
  cwd: ROOT,
});
