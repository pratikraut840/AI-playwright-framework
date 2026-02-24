/**
 * Wrapper for xunit-viewer: generates JUnit HTML report and opens in browser.
 * Avoids xunit-viewer crash when file is missing.
 * Usage: node scripts/view-junit.mjs <xmlPath> <htmlPath> <title>
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const [xmlPath, htmlPath, title] = process.argv.slice(2);
if (!xmlPath || !htmlPath || !title) {
  console.error('Usage: node scripts/view-junit.mjs <xmlPath> <htmlPath> <title>');
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

// Generate HTML (no -s server, so command completes)
const cmd = `npx xunit-viewer -r "${xmlPath}" -o "${htmlPath}" -t "${title}"`;
execSync(cmd, { stdio: 'inherit', cwd: ROOT });

// Open in browser
const resolvedHtml = path.resolve(ROOT, htmlPath);
const url = 'file:///' + resolvedHtml.replace(/\\/g, '/').replace(/^([A-Za-z]):/, '$1:');
try {
  if (process.platform === 'win32') {
    execSync(`start "" "${url}"`, { stdio: 'ignore' });
  } else if (process.platform === 'darwin') {
    execSync(`open "${url}"`, { stdio: 'ignore' });
  } else {
    execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
  }
  console.log('Opened JUnit report in browser.');
} catch (err) {
  console.log('Report saved at:', resolvedHtml);
}
