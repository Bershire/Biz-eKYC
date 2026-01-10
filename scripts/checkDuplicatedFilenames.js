const path = require('path');
const fs = require('fs');

/**
 * Check for case-insensitive duplicated filenames as it can cause error(s) on Windows
 */

const Normal = '\x1b[0m';
const FgRed = '\x1b[31m';

const dirFileMap = {};

process.argv.slice(2).forEach(filename => {
  const dirname = path.dirname(filename);
  const basename = path.basename(filename);

  if (!dirFileMap[dirname]) {
    dirFileMap[dirname] = [];
  }

  dirFileMap[dirname].push(basename);
});

let haveDuplicated = false;
Object.entries(dirFileMap).forEach(([dirname, basenames]) => {
  fs.readdirSync(dirname).forEach(file => {
    basenames.forEach(basename => {
      if (basename !== file && basename.toLowerCase() === file.toLowerCase()) {
        console.log(
          `- ${FgRed}Error: File ${dirname}/${basename} and ${dirname}/${file} names are the same case-insensitively${Normal}`,
        );
        haveDuplicated = true;
      }
    });
  });
});

process.exit(+haveDuplicated);
