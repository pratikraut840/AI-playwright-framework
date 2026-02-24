/**
 * Opens a file path or URL in the default browser (cross-platform).
 * Usage: node src/ui/helpers/scripts/open-in-browser.mjs <path-or-url>
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

const target = process.argv[2];
if (!target) {
  console.error('Usage: node src/ui/helpers/scripts/open-in-browser.mjs <path-or-url>');
  process.exit(1);
}

let url = target;
if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('file:')) {
  const resolved = path.resolve(ROOT, target);
  url = 'file:///' + resolved.replace(/\\/g, '/').replace(/^([A-Za-z]):/, '$1:');
}

try {
  if (process.platform === 'win32') {
    execSync(`start "" "${url}"`, { stdio: 'ignore' });
  } else if (process.platform === 'darwin') {
    execSync(`open "${url}"`, { stdio: 'ignore' });
  } else {
    execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
  }
  console.log('Opened in browser.');
} catch (err) {
  console.error('Failed to open in browser:', err.message);
  process.exit(1);
}
