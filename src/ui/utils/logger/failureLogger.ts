import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.resolve('logs');
const FAILURE_LOG_FILE = path.join(LOG_DIR, 'failures.log');

function ensureLogDir(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

export interface FailureLogEntry {
  scenarioName: string;
  step?: string;
  errorMessage: string;
  browser?: string;
  environment?: string;
}

/**
 * Appends a structured failure entry to logs/failures.log.
 * Call in Cucumber After hook when scenario.result.status === 'FAILED'.
 *
 * @example
 * After(async function (this: OrangeHRMWorld, scenario) {
 *   if (scenario.result?.status === Status.FAILED) {
 *     writeFailureLog({
 *       scenarioName: scenario.pickle.name,
 *       errorMessage: scenario.result.message ?? 'Unknown error',
 *       browser: process.env.BROWSER,
 *       environment: process.env.NODE_ENV,
 *     });
 *   }
 * });
 */
export function writeFailureLog(entry: FailureLogEntry): void {
  ensureLogDir();

  const SEPARATOR = '─'.repeat(60);
  const lineParts: (string | null)[] = [
    SEPARATOR,
    `Timestamp : ${new Date().toISOString()}`,
    `Scenario  : ${entry.scenarioName}`,
    entry.step ? `Step      : ${entry.step}` : null,
    `Error     : ${entry.errorMessage}`,
    entry.browser ? `Browser   : ${entry.browser}` : null,
    entry.environment ? `Env       : ${entry.environment}` : null,
    SEPARATOR,
    '',
  ];
  const lines = lineParts.filter((x): x is string => x !== null).join('\n');

  fs.appendFileSync(FAILURE_LOG_FILE, lines, 'utf-8');
}

/**
 * Clears the failures log file. Useful to call before a full test run.
 */
export function clearFailureLog(): void {
  ensureLogDir();
  fs.writeFileSync(FAILURE_LOG_FILE, '', 'utf-8');
}
