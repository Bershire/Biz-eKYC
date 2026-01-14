/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    'babel-plugin-macros',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js', '.json'],
        alias: {
          src: './src',
          tests: './tests',
        },
      },
    ],
    './babel-plugins/date-fns.js',
    '@babel/plugin-transform-react-constant-elements',
    'babel-plugin-react-anonymous-display-name',
    'react-native-reanimated/plugin', // needs to be last
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
  overrides: [
    {
      test: './src/*',
      plugins: ['./babel-plugins/hyper-log.js', './babel-plugins/inline.js'],
    },
  ],
};
