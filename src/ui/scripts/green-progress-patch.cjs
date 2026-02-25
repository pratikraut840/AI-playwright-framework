/**
 * Patches the progress package to render the bar in green.
 * Load via NODE_OPTIONS="--require ./src/ui/scripts/green-progress-patch.cjs"
 */
const Original = require('progress');
const green = '\x1b[32m';
const reset = '\x1b[0m';

function Patched(fmt, opts) {
  opts = { ...opts };
  opts.complete = green + (opts.complete || '=') + reset;
  return new Original(fmt, opts);
}

const mod = require.cache[require.resolve('progress')];
if (mod) mod.exports = Patched;
