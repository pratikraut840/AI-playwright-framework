/**
 * Runs Playwright TDD tests and writes output to playwright-report-tdd/test-output.txt
 * while also showing it in the terminal (cross-platform tee replacement).
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');
const LOG_FILE = path.join(ROOT, 'playwright-report-tdd', 'test-output.txt');

// Ensure directory exists
const logDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const extraArgs = process.argv.slice(2);
const playwrightCli = path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js');
const child = spawn(process.execPath, [playwrightCli, 'test', ...extraArgs], {
  cwd: ROOT,
  stdio: ['inherit', 'pipe', 'pipe'],
});

const chunks = [];

function capture(data) {
  const str = data.toString();
  process.stdout.write(str);
  chunks.push(str);
}

child.stdout.on('data', capture);
child.stderr.on('data', capture);

child.on('close', (code) => {
  const output = chunks.join('');
  try {
    fs.writeFileSync(LOG_FILE, output, 'utf-8');
    console.log(`\nLog written to: ${LOG_FILE}`);
  } catch (err) {
    console.error('Failed to write log file:', err.message);
  }
  process.exit(code ?? 0);
});
