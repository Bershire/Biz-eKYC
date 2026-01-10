const icon = require('./importIcons');
const image = require('./importImages');
const language = require('./importLanguages');

const assets = [icon, image, language];

const args = process.argv.slice(2);
if (args.includes('--watch') || args.includes('-w')) {
  const chokidar = require('chokidar');

  assets.forEach(asset => {
    const controlledImportFn = debounce(asset.importFn, 700);
    chokidar
      .watch(asset.dir, {
        disableGlobbing: true,
      })
      .on('add', controlledImportFn)
      .on('change', controlledImportFn)
      .on('unlink', controlledImportFn);
  });
} else {
  assets.forEach(asset => asset.importFn());
}

function debounce(func, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
