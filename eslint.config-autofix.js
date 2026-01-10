const { FlatCompat } = require('@eslint/eslintrc');
const tseslint = require('typescript-eslint');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');
const stylistic = require('@stylistic/eslint-plugin');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: {},
});

const allTseslintStylisticRules = tseslint.configs.stylisticTypeChecked.flatMap(config => {
  return Object.keys(config.rules ?? {}).filter(rule => rule.startsWith('@typescript-eslint/'));
});

module.exports = tseslint.config(
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
    linterOptions: {
      noInlineConfig: true,
    },
  },
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-native': reactNative,
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
      '@stylistic/lines-between-class-members': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never' }],
      'react-native/no-single-element-style-arrays': 'error',
      ...Object.fromEntries(allTseslintStylisticRules.map(rule => [rule, 'off'])),
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
      '@typescript-eslint/no-inferrable-types': [
        'error',
        { ignoreParameters: true, ignoreProperties: true },
      ],
    },
  },
  { files: ['src/i18n/resources/*/*.json'] },
  ...compat.config({
    plugins: ['i18n-json'],
    rules: {
      'i18n-json/sorted-keys': 'error',
    },
  }),
);
