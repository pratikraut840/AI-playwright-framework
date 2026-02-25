/**
 * Builds rich metadata and custom data for the multiple-cucumber-html-reporter,
 * similar to Allure's Environment and Executor sections.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { platform, release, hostname, cpus, totalmem } from 'os';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDateDDMonthYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatTimeHHmmss(date: Date): string {
  return date.toTimeString().slice(0, 8);
}

function formatDateTime(date: Date): string {
  return `${formatDateDDMonthYYYY(date)} ${formatTimeHHmmss(date)}`;
}

function safeExec(cmd: string): string {
  try {
    return String(execSync(cmd, { encoding: 'utf-8', timeout: 2000 })).trim();
  } catch {
    return '';
  }
}

function getGitInfo(): { branch: string; commit: string; repo: string } {
  const branch = process.env.GITHUB_REF_NAME ?? process.env.GIT_BRANCH ?? process.env.BRANCH_NAME ?? safeExec('git rev-parse --abbrev-ref HEAD');
  const commit = process.env.GITHUB_SHA?.slice(0, 7) ?? process.env.GIT_COMMIT?.slice(0, 7) ?? safeExec('git rev-parse --short HEAD');
  const repo = process.env.GITHUB_REPOSITORY ?? '';
  return { branch, commit, repo };
}

function getPackageInfo(): {
  version: string;
  playwright: string;
  cucumber: string;
  author: string;
  description: string;
} {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    return {
      version: pkg.version ?? '1.0.0',
      playwright: deps['@playwright/test']?.replace('^', '') ?? 'unknown',
      cucumber: deps['@cucumber/cucumber']?.replace('^', '') ?? 'unknown',
      author: typeof pkg.author === 'string' ? pkg.author : (pkg.author?.name ?? ''),
      description: pkg.description ?? 'Playwright Hybrid Automation Framework',
    };
  } catch {
    return { version: '1.0.0', playwright: 'unknown', cucumber: 'unknown', author: '', description: '' };
  }
}

/** Build metadata (browser, device, platform) for the Cucumber HTML report */
export function getCucumberMetadata() {
  const pkg = getPackageInfo();
  const memGb = (totalmem() / 1024 / 1024 / 1024).toFixed(2);

  return {
    browser: {
      name: process.env.BROWSER ?? 'chromium',
      version: 'latest',
    },
    device: `Local Machine • ${cpus().length} CPU(s) • ${memGb} GB RAM`,
    platform: {
      name: platform(),
      version: release(),
    },
  };
}

/** Build rich custom data block for the Cucumber HTML report */
export function getCucumberCustomData() {
  const NOW = new Date();
  const git = getGitInfo();
  const pkg = getPackageInfo();
  const executionMode = process.env.CI === 'true' ? 'CI Pipeline' : 'Local';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const data: Array<{ label: string; value: string }> = [
    { label: 'Project', value: 'AI Framework Playwright' },
    { label: 'Test Suite', value: 'OrangeHRM BDD (Cucumber)' },
    { label: 'Project Version', value: pkg.version },
    { label: 'Framework', value: `Playwright ${pkg.playwright} + Cucumber ${pkg.cucumber}` },
    { label: 'Author', value: pkg.author || 'N/A' },
    { label: 'Description', value: pkg.description },
    { label: 'Execution Mode', value: executionMode },
    { label: 'Execution Date', value: formatDateDDMonthYYYY(NOW) },
    { label: 'Execution Time', value: formatDateTime(NOW) },
    { label: 'Timezone', value: timezone },
    { label: 'Environment', value: process.env.NODE_ENV ?? 'dev' },
    { label: 'Node Version', value: process.version },
    { label: 'OS', value: `${platform()} ${release()}` },
    { label: 'Hostname', value: hostname() },
    { label: 'Base URL', value: process.env.ORANGEHRM_BASE_URL ?? 'https://opensource-demo.orangehrmlive.com' },
    { label: 'Browser', value: process.env.BROWSER ?? 'chromium' },
  ];

  if (git.branch) data.push({ label: 'Git Branch', value: git.branch });
  if (git.commit) data.push({ label: 'Git Commit', value: git.commit });
  if (git.repo) data.push({ label: 'Repository', value: git.repo });

  return {
    title: 'Test Run Info — Environment & Execution',
    data,
  };
}
