// @ts-check
const TS_PLUGIN = require('@typescript-eslint/eslint-plugin');
const TS_PARSER = require('@typescript-eslint/parser');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    // Files to lint
    files: ['**/*.ts'],

    // Files / directories to completely ignore
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      'test-results/**',
      'reports/**',
    ],

    languageOptions: {
      parser: TS_PARSER,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },

    plugins: {
      '@typescript-eslint': TS_PLUGIN,
    },

    rules: {
      // ── Core ECMAScript / code-quality rules ──────────────────────────────
      'no-console':        'warn',               // flag leftover console.log calls
      'no-debugger':       'error',              // never ship debugger statements
      'no-duplicate-case': 'error',              // duplicate switch cases
      'no-unreachable':    'error',              // code after return/throw/break
      'no-unused-vars':    'off',                // handled by @typescript-eslint rule below
      'no-undef':          'off',                // TypeScript handles this
      'eqeqeq':            ['error', 'always'],  // require === instead of ==
      'curly':             ['error', 'all'],     // always use braces for control-flow
      'prefer-const':      'error',              // use const where variable is never reassigned
      'no-var':            'error',              // ban var, prefer let/const

      // ── TypeScript-specific rules ─────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any':        'warn',   // discourage unsafe `any`
      '@typescript-eslint/explicit-function-return-type': 'off', // too noisy for test files
      '@typescript-eslint/no-floating-promises':   'error',  // always await promises
      '@typescript-eslint/no-misused-promises':    'error',  // no async void callbacks
      '@typescript-eslint/consistent-type-imports':'warn',   // use `import type` where possible
    },
  },
];
