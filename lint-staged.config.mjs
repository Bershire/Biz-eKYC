import micromatch from 'micromatch';
import path from 'path';

const eslintPath = '{{src,tests}/**/*.{ts,tsx},index.js,src/i18n/resources/*/*.json}';

export default {
  '{*,**/*,__parallel-1__}': [
    'node ./scripts/checkDuplicatedFilenames.js',
    'editorconfig-checker',
    files => {
      const cwd = process.cwd();
      const relativePaths = files.map(file => path.relative(cwd, file));

      return (
        'eslint --fix --config eslint.config-autofix.js --cache --cache-location .eslintcache-autofix --quiet --no-warn-ignored --no-error-on-unmatched-pattern ' +
        micromatch(relativePaths, eslintPath, {
          dot: true,
          matchBase: !eslintPath.includes('/'),
          posixSlashes: true,
          strictBrackets: true,
        }).join(' ')
      );
    },
    'prettier --write --cache --cache-location .prettiercache --ignore-unknown',
  ],
  '{*,**/*,__parallel-2__}': () => 'ls-lint',
  [eslintPath]: 'eslint --cache --quiet --no-warn-ignored --no-error-on-unmatched-pattern',
  '{{src,tests}/**/*.{ts,tsx},index.js,.yarn/patches/*.patch}': () => 'tsc --skipLibCheck --noEmit',
};
