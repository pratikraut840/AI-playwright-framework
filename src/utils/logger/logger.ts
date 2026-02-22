import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.resolve('logs');
const DEBUG_LOG_FILE = path.join(LOG_DIR, 'debug.log');

function ensureLogDir(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function timestamp(): string {
  return new Date().toISOString();
}

function formatLine(level: string, message: string, context?: string): string {
  const ctx = context ? ` [${context}]` : '';
  return `[${timestamp()}] [${level}]${ctx} ${message}\n`;
}

/**
 * Enables debug file logging. Writes all subsequent log() calls to logs/debug.log.
 * Call once at test setup (e.g. in hooks.ts BeforeAll).
 */
export function enableDebugFileLogging(): void {
  ensureLogDir();
  const header = formatLine('INFO', '── Debug logging session started ──');
  fs.appendFileSync(DEBUG_LOG_FILE, header, 'utf-8');
}

/**
 * Writes a DEBUG-level message to logs/debug.log.
 */
export function log(message: string, context?: string): void {
  ensureLogDir();
  fs.appendFileSync(DEBUG_LOG_FILE, formatLine('DEBUG', message, context), 'utf-8');
}

/**
 * Writes an INFO-level message to logs/debug.log.
 */
export function logInfo(message: string, context?: string): void {
  ensureLogDir();
  fs.appendFileSync(DEBUG_LOG_FILE, formatLine('INFO', message, context), 'utf-8');
}

/**
 * Writes a WARN-level message to logs/debug.log.
 */
export function logWarn(message: string, context?: string): void {
  ensureLogDir();
  fs.appendFileSync(DEBUG_LOG_FILE, formatLine('WARN', message, context), 'utf-8');
}
