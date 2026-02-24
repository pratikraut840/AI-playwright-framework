/**
 * Wrapper for xunit-viewer: generates JUnit HTML report and serves it via HTTP.
 * Served over HTTP because file:// can cause blank/empty display in browsers.
 * Usage: node src/helpers/scripts/view-junit.mjs <xmlPath> <htmlPath> <title>
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

const [xmlPath, htmlPath, title] = process.argv.slice(2);
if (!xmlPath || !htmlPath || !title) {
  console.error('Usage: node src/helpers/scripts/view-junit.mjs <xmlPath> <htmlPath> <title>');
  process.exit(1);
}

const resolvedXml = path.resolve(ROOT, xmlPath);
if (!fs.existsSync(resolvedXml)) {
  console.error(`Error: JUnit XML not found at ${xmlPath}`);
  console.error('Run the corresponding tests first (e.g. npm run test:bdd or npm run test:tdd).');
  process.exit(1);
}

const htmlDir = path.dirname(path.resolve(ROOT, htmlPath));
if (!fs.existsSync(htmlDir)) {
  fs.mkdirSync(htmlDir, { recursive: true });
}

// Generate HTML and serve via HTTP (-s). Opening file:// often shows blank due to browser restrictions.
// Server runs until user presses Ctrl+C.
const cmd = `npx xunit-viewer -r "${xmlPath}" -o "${htmlPath}" -t "${title}" -s`;
execSync(cmd, { stdio: 'inherit', cwd: ROOT });
