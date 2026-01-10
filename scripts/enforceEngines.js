#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const semver = require('semver');
const pkg = require('../package.json');

const Normal = '\x1b[0m';
const FgWhite = '\x1b[1m\x1b[37m';
const FgBlack = '\x1b[1m\x1b[30m';
const BgRed = '\x1b[41m';
const BgYellow = '\x1b[43m';

async function enforce() {
  let exitCode = 0;

  for ([engine, expectedVersion] of Object.entries(pkg.engines)) {
    let version;
    if (engine === 'node') {
      version = process.version;
    } else {
      try {
        version = (await exec(engine + ' --version')).stdout;
      } catch (_) {}
      if (!version) {
        try {
          version = (await exec(engine + ' -v')).stdout;
        } catch (_) {}
      }

      if (!version) {
        console.log(`${BgYellow}${FgBlack}Warning: Cannot detect '${engine}' version.${Normal}`);
        continue;
      }
    }

    const coercedVersion = semver.coerce(version);
    if (!semver.satisfies(coercedVersion, expectedVersion)) {
      console.log(
        `${BgRed}${FgWhite}Error: Invalid '${engine}' version. Expected ${expectedVersion} but got ${coercedVersion}.${Normal}`,
      );
      exitCode = 1;
    }
  }

  return exitCode;
}
enforce().then(exitCode => process.exit(exitCode));
