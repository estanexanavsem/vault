// @ts-check
const js = require('@eslint/js')
const prettierConfig = require('eslint-config-prettier/flat')
const { defineConfig, globalIgnores } = require('eslint/config')
const pluginQuery = require('@tanstack/eslint-plugin-query')
const reactHooks = require('eslint-plugin-react-hooks')
const reactRefresh = require('eslint-plugin-react-refresh').default
const globals = require('globals')
const tseslint = require('typescript-eslint')

const noDefaultExportRules = [
  {
    selector: 'ExportDefaultDeclaration',
    message: 'Default exports are banned. Use named exports instead.',
  },
  {
    selector: "ExportNamedDeclaration > ExportSpecifier[exported.name='default']",
    message: 'Default exports are banned. Use named exports instead.',
  },
]

module.exports = defineConfig([
  globalIgnores(['dist/', 'node_modules/']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended, prettierConfig],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-restricted-syntax': ['error', ...noDefaultExportRules],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      ...pluginQuery.configs['flat/recommended-strict'],
      prettierConfig,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-restricted-syntax': ['error', ...noDefaultExportRules],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['*.config.{js,ts,cjs}', 'eslint.config.cjs'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
])
