module.exports = {
  plugins: ['prettier-plugin-organize-imports'],
  printWidth: 100,
  singleQuote: true,
  jsxSingleQuote: true,
  bracketSameLine: false,
  trailingComma: 'all',
  arrowParens: 'avoid',
  organizeImportsSkipDestructiveCodeActions: true,
  experimentalTernaries: true,
  overrides: [
    {
      files: '*.svg',
      options: {
        parser: 'html',
      },
    },
    {
      files: '.ecrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: '.svgrrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: '.watchmanconfig',
      options: {
        parser: 'json',
      },
    },
  ],
};
