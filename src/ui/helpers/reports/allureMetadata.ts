/**
 * Writes Allure metadata (environment.properties, executor.json, categories.json)
 * to results directories for rich Environment, Executor, and Categories in reports.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { platform, release, hostname, cpus, totalmem } from 'os';

type AllureLayer = 'bdd' | 'tdd' | 'api';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const BUILD_ORDER = Math.floor(Date.now() / 1000);

/** Format date as DD-Month-YYYY (e.g. 24-February-2025) for Allure report display */
function formatDateDDMonthYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/** Format time as HH:mm:ss (e.g. 14:30:45) */
function formatTimeHHmmss(date: Date): string {
  return date.toTimeString().slice(0, 8);
}

/** Format date and time as DD-Month-YYYY HH:mm:ss for Allure report display */
function formatDateDDMonthYYYYTime(date: Date): string {
  return `${formatDateDDMonthYYYY(date)} ${formatTimeHHmmss(date)}`;
}

const NOW = new Date();
/** Execution date in DD-Month-YYYY format for report */
const EXECUTED_AT_DISPLAY = formatDateDDMonthYYYY(NOW);
/** Execution date and time in DD-Month-YYYY HH:mm:ss for report */
const EXECUTED_AT_DISPLAY_FULL = formatDateDDMonthYYYYTime(NOW);
const EXECUTED_AT = NOW.toISOString();

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
  allure: string;
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
      allure: deps['allure-playwright']?.replace('^', '') ?? deps['allure-commandline']?.replace('^', '') ?? 'unknown',
      author: typeof pkg.author === 'string' ? pkg.author : (pkg.author?.name ?? ''),
      description: pkg.description ?? 'Playwright + Cucumber BDD automation framework',
    };
  } catch {
    return { version: '1.0.0', playwright: 'unknown', allure: 'unknown', author: '', description: '' };
  }
}

function getEnvironmentProps(layer: AllureLayer): Record<string, string> {
  const git = getGitInfo();
  const pkg = getPackageInfo();
  const memGb = (totalmem() / 1024 / 1024 / 1024).toFixed(2);

  const base: Record<string, string> = {
    'Project': 'AI Framework Playwright',
    'Project.Version': pkg.version,
    'Project.Description': pkg.description,
    'Framework.Author': pkg.author || 'N/A',
    'Execution.Layer': layer.toUpperCase(),
    'Execution.Date': EXECUTED_AT_DISPLAY,
    'Execution.Time': formatTimeHHmmss(NOW),
    'Execution.Mode': process.env.CI === 'true' ? 'CI' : 'Local',
    'Execution.Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    'Node.Version': process.version,
    'OS.Platform': platform(),
    'OS.Release': release(),
    'OS.Arch': process.arch,
    'Host.Hostname': hostname(),
    'System.CPU.Count': String(cpus().length),
    'System.Memory.GB': `${memGb} GB`,
    'CI': process.env.CI === 'true' ? 'Yes' : 'No',
    'Environment': process.env.NODE_ENV ?? 'dev',
    'Browser': process.env.BROWSER ?? 'chromium',
    'Framework': 'Playwright + TypeScript',
    'Language': 'TypeScript',
    'Playwright.Version': pkg.playwright,
    'Allure.Version': pkg.allure,
  };

  if (git.branch) base['Git.Branch'] = git.branch;
  if (git.commit) base['Git.Commit'] = git.commit;
  if (git.repo) base['Git.Repository'] = git.repo;

  if (layer === 'api') {
    base['API.Base.URL'] = process.env.RESTFUL_BOOKER_BASE_URL ?? 'https://restful-booker.herokuapp.com';
    base['API.Target'] = 'Restful-Booker';
    base['Test.Type'] = 'REST API';
    base['Response.Time.Threshold'] = (process.env.API_RESPONSE_TIME_THRESHOLD ?? '5000') + ' ms';
  }

  if (layer === 'bdd' || layer === 'tdd') {
    base['UI.Base.URL'] = process.env.ORANGEHRM_BASE_URL ?? 'https://opensource-demo.orangehrmlive.com';
    base['Test.Type'] = layer === 'bdd' ? 'BDD (Cucumber)' : 'TDD (Playwright)';
  }

  return base;
}

function writeEnvironmentProperties(resultsDir: string, layer: AllureLayer): void {
  const props = getEnvironmentProps(layer);
  const content = Object.entries(props)
    .map(([k, v]) => `${k} = ${String(v).replace(/\\/g, '\\\\')}`)
    .join('\n');
  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), content, 'utf-8');
}

function writeExecutor(resultsDir: string, layer: AllureLayer): void {
  const layerNames = {
    api: 'Restful-Booker API',
    bdd: 'OrangeHRM BDD (Cucumber)',
    tdd: 'OrangeHRM TDD (Playwright)',
  };
  const layerName = layerNames[layer];
  const reportName = `${layerName} — Build #${BUILD_ORDER}`;

  const ciType = process.env.GITHUB_ACTIONS ? 'github' :
    process.env.GITLAB_CI ? 'gitlab' :
    process.env.JENKINS_HOME ? 'jenkins' :
    process.env.BUILDKITE ? 'buildkite' :
    process.env.TF_BUILD ? 'azure' :
    process.env.CIRCLECI ? 'circleci' :
    process.env.TRAVIS ? 'travis' :
    process.env.BITBUCKET_BUILD_NUMBER ? 'bitbucket' : 'local';

  const git = getGitInfo();
  const pkg = getPackageInfo();
  const runDescription = [
    pkg.author && `Author: ${pkg.author}`,
    git.branch && `Branch: ${git.branch}`,
    git.commit && `Commit: ${git.commit}`,
    `Layer: ${layerName}`,
    `Generated: ${EXECUTED_AT_DISPLAY_FULL}`,
  ].filter(Boolean).join(' • ');

  const jobName = process.env.GITHUB_JOB ?? process.env.JOB_NAME ?? process.env.CIRCLE_JOB ?? 'Test Run';

  const executor: Record<string, unknown> = {
    reportName,
    buildOrder: BUILD_ORDER,
    buildName: `build-${BUILD_ORDER}`,
    name: process.env.CI ? `${ciType.toUpperCase()} Pipeline` : 'Local Machine',
    type: ciType,
    runDescription,
    jobName,
  };

  if (process.env.BUILD_URL) executor.buildUrl = process.env.BUILD_URL;
  else if (process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID) {
    executor.buildUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  } else if (process.env.GITLAB_CI && process.env.CI_PIPELINE_URL) {
    executor.buildUrl = process.env.CI_PIPELINE_URL;
  }
  if (process.env.REPORT_URL) executor.reportUrl = process.env.REPORT_URL;

  const cleaned = Object.fromEntries(
    Object.entries(executor).filter(([, v]) => v !== undefined && v !== '')
  );
  fs.writeFileSync(
    path.join(resultsDir, 'executor.json'),
    JSON.stringify(cleaned, null, 2),
    'utf-8'
  );
}

function writeCategories(resultsDir: string): void {
  const categories = [
    {
      name: 'API / Network Errors',
      messageRegex: '.*(timeout|ECONNREFUSED|ETIMEDOUT|network|fetch failed|socket hang).*',
      traceRegex: '.*',
      matchedStatuses: ['failed', 'broken'],
    },
    {
      name: 'Authentication / 401 Errors',
      messageRegex: '.*(401|Unauthorized|Invalid credentials|Token expired).*',
      traceRegex: '.*',
      matchedStatuses: ['failed', 'broken'],
    },
    {
      name: 'Validation / 4xx Client Errors',
      messageRegex: '.*(400|403|404|422|validation|Bad Request|Not Found|Forbidden).*',
      traceRegex: '.*',
      matchedStatuses: ['failed'],
    },
    {
      name: 'Server / 5xx Errors',
      messageRegex: '.*(500|502|503|Internal Server Error|Service Unavailable).*',
      traceRegex: '.*',
      matchedStatuses: ['failed', 'broken'],
    },
    {
      name: 'Assertion Failures',
      messageRegex: '.*(expect|assert|Expected|received).*',
      traceRegex: '.*',
      matchedStatuses: ['failed'],
    },
    {
      name: 'Timeout / Performance',
      messageRegex: '.*(timeout|exceeded|slow|duration).*',
      traceRegex: '.*',
      matchedStatuses: ['failed', 'broken'],
    },
    {
      name: 'Flaky Tests',
      messageRegex: '.*',
      traceRegex: '.*',
      matchedStatuses: ['failed', 'broken'],
      flaky: true,
    },
    {
      name: 'Skipped Tests',
      matchedStatuses: ['skipped'],
    },
  ];
  fs.writeFileSync(
    path.join(resultsDir, 'categories.json'),
    JSON.stringify(categories, null, 2),
    'utf-8'
  );
}

/**
 * Writes environment.properties, executor.json, and categories.json to the given results directory.
 * Call before allure generate to show Environment, Executor, and Categories in the report.
 */
export function writeAllureMetadata(resultsDir: string, layer: AllureLayer): void {
  const resolved = path.resolve(resultsDir);
  if (!fs.existsSync(resolved)) {
    fs.mkdirSync(resolved, { recursive: true });
  }
  writeEnvironmentProperties(resolved, layer);
  writeExecutor(resolved, layer);
  writeCategories(resolved);
}
