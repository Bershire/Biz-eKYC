const { FlatCompat } = require('@eslint/eslintrc');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const rnxKit = require('@rnx-kit/eslint-plugin');
const neverDisable = require('eslint-plugin-never-disable');
const reactNative = require('@react-native/eslint-config');
const unicorn = require('eslint-plugin-unicorn');
const prettier = require('eslint-config-prettier');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: {},
});

// typescript-eslint v7 compatibility
reactNativeRecommended = [];
reactNative.overrides?.forEach(override => {
  if (override.files?.includes('*.ts') || override.files?.includes('*.tsx')) {
    reactNativeRecommended.push({
      rules: override.rules,
    });
  }

  if (override.env?.jest === true) {
    reactNativeRecommended.push(...compat.config({ overrides: [override] }));
  }
});
delete reactNative.overrides;
reactNativeRecommended.push(...compat.config(reactNative));

module.exports = (async () => {
  const arrayFunc = (await import('eslint-plugin-array-func')).default;

  return tseslint.config(
    {
      ignores: [
        'node_modules',
        '{android,ios}',
        '{.vscode,.yarn,.husky,_templates}',
        '{scripts,babel-plugins}',
        '*.{js,mjs,cjs,json}',
        '!index.js',
        'src/assets/{fonts,images,icons}/**/*',
      ],
    },
    {
      languageOptions: {
        parserOptions: {
          project: true,
          tsconfigRootDir: __dirname,
          sourceType: 'module',
        },
        globals: {
          NodeJS: true,
        },
      },
    },
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...reactNativeRecommended,
    arrayFunc.configs.recommended,
    unicorn.configs['flat/recommended'],
    ...compat.config({
      extends: [
        'plugin:@eslint-community/eslint-comments/recommended',
        'plugin:promise/recommended',
        'plugin:regexp/recommended',
        'plugin:optimize-regex/recommended',
        'plugin:jest/recommended',
        'plugin:react-hooks/recommended',
        'plugin:i18next/recommended',
        'plugin:sonarjs/recommended-legacy',
        'plugin:etc/recommended',
      ],
    }),
    prettier,
    {
      plugins: {
        '@rnx-kit': rnxKit,
        'never-disable': neverDisable,
      },
      rules: {
        'prettier/prettier': 'off',
        'array-callback-return': ['error', { allowImplicit: true }],
        'default-case': 'error',
        'default-case-last': 'error',
        'default-param-last': 'error',
        eqeqeq: ['error', 'always', { null: 'ignore' }],
        'grouped-accessor-pairs': 'error',
        'no-div-regex': 'error',
        'no-else-return': ['error', { allowElseIf: false }],
        'no-empty-function': [
          'error',
          {
            allow: ['arrowFunctions', 'functions', 'methods'],
          },
        ],
        'no-empty-pattern': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-extra-label': 'error',
        'no-lone-blocks': 'error',
        'no-loop-func': 'error',
        'no-new-wrappers': 'error',
        'no-self-compare': 'error',
        'no-throw-literal': 'error',
        'no-unused-expressions': 'error',
        'no-useless-concat': 'error',
        'no-useless-return': 'error',
        'no-cond-assign': ['warn', 'always'],
        'no-constant-binary-expression': 'error',
        'no-empty': 'error',
        'no-ex-assign': 'error',
        'no-extra-boolean-cast': 'error',
        'no-promise-executor-return': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'warn',
        'no-unsafe-negation': 'error',
        'no-label-var': 'error',
        'no-confusing-arrow': ['error', { onlyOneSimpleParam: true }],
        'prefer-numeric-literals': 'error',
        'prefer-rest-params': 'error',
        'prefer-template': 'error',
        'require-yield': 'error',
        'valid-typeof': ['error', { requireStringLiterals: true }],
        'use-isnan': 'error',
        radix: ['error', 'as-needed'],
        'max-lines': ['error', 500],
        'max-lines-per-function': ['error', 500],
        'regexp/unicode-property': 'error',
        'react/self-closing-comp': 'off',
        'react/jsx-boolean-value': 'error',
        'react-native/no-inline-styles': 'off',
        'promise/always-return': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/prefer-spread': 'off',
        'unicorn/no-useless-undefined': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/no-array-reduce': 'off',
        'optimize-regex/optimize-regex': 'error',
        'etc/no-commented-out-code': 'error',
        camelcase: 'off',
        'no-unneeded-ternary': 'error',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        '@typescript-eslint/no-invalid-void-type': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-confusing-void-expression': [
          'error',
          { ignoreArrowShorthand: true },
        ],
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'function',
            format: ['camelCase'],
            filter: {
              regex: '^[a-z]',
              match: false,
            },
            prefix: ['__INLINE__', '_'],
          },
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'parameter',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'memberLike',
            modifiers: ['private'],
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'require',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: [
              'classProperty',
              'objectLiteralProperty',
              'typeProperty',
              'classMethod',
              'objectLiteralMethod',
              'typeMethod',
              'accessor',
              'enumMember',
            ],
            format: null,
          },
          {
            selector: 'variable',
            format: null,
            modifiers: ['destructured'],
          },
        ],
        'react-native/split-platform-components': 'off',
        'react-native/no-inline-styles': 'off',
        'react-native/no-color-literals': 'off',
        'sonarjs/cognitive-complexity': ['error', 30],
        'sonarjs/no-duplicate-string': ['error', { ignoreStrings: 'flex-start,flex-end' }],
        'unicorn/prefer-top-level-await': 'off',
        'react-native/no-unused-styles': 'error',
        'react-native/no-raw-text': ['error', { skip: ['AppText'] }],
        'react-native/no-single-element-style-arrays': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@rnx-kit/no-const-enum': 'error',
        '@rnx-kit/no-export-all': 'error',
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/numeric-separators-style': 'off',
        'react-hooks/exhaustive-deps': [
          'error',
          {
            additionalHooks:
              '(useMotiPressableTransition|useMotiPressable|useMotiPressables|useMotiPressableAnimatedProps|useInterpolateMotiPressable|useFrameProcessor)',
          },
        ],
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@eslint-community/eslint-comments/disable-enable-pair': 'off',
        '@eslint-community/eslint-comments/no-unused-disable': 'error',
        '@eslint-community/eslint-comments/no-restricted-disable': [
          'error',
          '@eslint-community/eslint-comments/no-restricted-disable',
          'never-disable/rules',
        ],
        'never-disable/rules': [
          'error',
          {
            rules: [
              {
                message: 'This is literally the rule itself.',
                rule: 'never-disable/rules',
              },
              {
                message: 'This is the rule to make this rule cannot be disabled.',
                rule: '@eslint-community/eslint-comments/no-restricted-disable',
              },
              {
                message:
                  'Please add an "_" before or remove the unused variables, not disabling the rule.',
                rule: '.*/no-unused-vars',
              },
              {
                message: "Please use index as key if there's nothing else to use as a key.",
                rule: 'react/jsx-key',
              },
              {
                message:
                  'Using deprecated APIs can cause compatibility, security, performance, or reliability issues for your application, and make it harder to upgrade to newer versions of the library.',
                rule: 'etc/no-deprecated',
              },
            ],
          },
        ],
        '@eslint-community/eslint-comments/require-description': 'warn',
      },
      settings: {
        'import/resolver': {
          typescript: { alwaysTryTypes: true },
        },
      },
    },
    ...compat.extends('plugin:i18n-json/recommended'),
    {
      files: ['src/i18n/resources/*/*.json'],
      rules: {
        'etc/no-commented-out-code': 'off',
        'i18n-json/valid-message-syntax': 'off',
        'i18n-json/sorted-keys': 'off', // autofixable
        'max-lines': 'off',
      },
    },
  );
})();
