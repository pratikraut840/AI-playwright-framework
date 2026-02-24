/**
 * Opens BDD and TDD reports when data exists. Does not fail if one is missing.
 */
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

function run(cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

let opened = 0;
if (run('npm run report:bdd')) opened++;
if (run('npm run report:tdd')) opened++;

if (opened === 0) {
  console.error('No reports opened. Run npm run test:bdd and/or npm run test:tdd first.');
  process.exit(1);
}
console.log(`Opened ${opened} report(s).`);
