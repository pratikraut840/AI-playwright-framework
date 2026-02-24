const timestamp = new Date()
  .toISOString()
  .replace(/T/, '_')
  .replace(/:/g, '-')
  .replace(/\..+/, '');

const DEFAULT_PROFILE = {
  requireModule: ['ts-node/register'],
  require: [
    'src/helpers/hooks/hooks.ts',
    'src/stepDefinitions/**/*.steps.ts',
  ],
  paths: ['src/tests/features/**/*.feature'],
  format: [
    'progress-bar',
    ['json', 'test-results/cucumber-json/cucumber-report.json'],
    ['html', 'test-results/cucumber-html-report/index.html'],
    'allure-cucumberjs/reporter',
  ],
  formatOptions: {
    snippetInterface: 'async-await',
    resultsDir: 'allure-results-bdd',
    printAttachments: false,
  },
};

/** Use --profile progress if progress-bar doesn't show: npm run test:bdd -- --profile progress */
export const progress = {
  ...DEFAULT_PROFILE,
  format: [
    'progress',
    ['json', 'test-results/cucumber-json/cucumber-report.json'],
    ['html', 'test-results/cucumber-html-report/index.html'],
    'allure-cucumberjs/reporter',
  ],
};

export default DEFAULT_PROFILE;
