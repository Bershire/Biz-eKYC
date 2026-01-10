#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const { program, Argument, Option } = require('commander');
const readlineSync = require('readline-sync');
let app = require('../app.json');
const pkg = require('../package.json');
const semver = require('semver');

const ANDROID_UAT_FLAVOR = 'development';
const ANDROID_PROD_FLAVOR = 'production';
const IOS_UAT_TARGET = 'TConnectDev';
const IOS_PROD_TARGET = 'TConnect';

if (!validateVersionObject(app.version)) {
  console.error('error: invalid version structure in app.json');
  process.exit(1);
}

program
  .description('Version both your android and ios apps with support for different flavors.')
  .addArgument(
    new Argument('[flavor]', 'Flavor you want to change the version.').choices(['uat', 'prod']),
  )
  .addOption(
    new Option(
      '-v, --version <version>',
      'Set new version string. This will set both android and ios app versions.',
    ).conflicts(['androidVersion', 'iosVersion']),
  )
  .addOption(
    new Option('-a, --android-version <version>', 'Set only the android version string.').conflicts(
      'iosVersion',
    ),
  )
  .option('-i, --ios-version <version>', 'Set only the ios version string.')
  .addOption(
    new Option(
      '-b, --bump-build-number [target]',
      'Bump only the build number of the target without changing the version. Default to both',
    )
      .choices(['android', 'ios'])
      .conflicts(['version', 'androidVersion', 'iosVersion']),
  )
  .addOption(
    new Option(
      '-s, --sync',
      'Sync all version information from app.json to native configs',
    ).conflicts(['version', 'androidVersion', 'iosVersion', 'bumpBuildNumber']),
  )
  .parse(process.argv);

const opts = program.opts();
let flavor = program.args[0];

if (!flavor && !opts.sync) {
  console.error("error: missing required argument 'flavor'");
  process.exit(1);
}

if (flavor && opts.sync) {
  console.error("error: option '-s, --sync' cannot be used with argument 'flavor'");
  process.exit(1);
}

const stdout = execSync('git status --porcelain');
const gitStatusLines = stdout
  .toString()
  .trim()
  .split('\n')
  .filter(line => line.trim() && !line.match(/^\?\? /))
  .map(line => line.trim())
  .filter(line => (opts.sync ? line !== 'M app.json' : true));
if (gitStatusLines.length) {
  console.error('error: git working directory not clean:\n' + gitStatusLines.join('\n'));
  console.error(
    'Please commit or stash your changes first' +
      (opts.sync ? ' except the version changes inside app.json' : ''),
  );
  process.exit(1);
}

let currentVersions;
let newAndroidVersion, newIosVersion, newAndroidBuildNumber, newIosBuildNumber;

if (flavor) {
  currentVersions = app.version[flavor];
  newAndroidVersion = currentVersions.androidVersion;
  newIosVersion = currentVersions.iosVersion;
  newAndroidBuildNumber = currentVersions.androidBuildNumber;
  newIosBuildNumber = currentVersions.iosBuildNumber;

  if (!opts.bumpBuildNumber) {
    if (!opts.version && !opts.androidVersion && !opts.iosVersion) {
      let currentVersion = currentVersions.androidVersion;
      if (currentVersion !== currentVersions.iosVersion) {
        currentVersion = `android - ${currentVersion}, ios - ${currentVersions.iosVersion}`;
      }

      console.log(`Current version: ${currentVersion}`);
      while (true) {
        const newVersion = readlineSync.question('New version (? for help): ').trim();
        if (newVersion === '' || newVersion === '?') {
          console.log('  - Type only the version to change both android and ios, e.g., 1.0.0');
          console.log('  - Type "a:VERSION" to change android only, e.g., a:1.0.0');
          console.log('  - Type "i:VERSION" to change ios only, e.g., i:1.0.0');
          console.log(
            '  - Type "a:VERSION,i:VERSION" to change versions independently, e.g., a:1.0.0,i:1.0.1',
          );
          continue;
        }

        newVersion.split(',').forEach(version => {
          if (version.startsWith('a:')) {
            newAndroidVersion = version.substring(2);
          } else if (version.startsWith('i:')) {
            newIosVersion = version.substring(2);
          } else {
            newAndroidVersion = version;
            newIosVersion = version;
          }
        });

        break;
      }
    } else {
      if (opts.version) {
        newAndroidVersion = opts.version;
        newIosVersion = opts.version;
      }
      if (opts.androidVersion) {
        newAndroidVersion = opts.androidVersion;
      }
      if (opts.iosVersion) {
        newIosVersion = opts.iosVersion;
      }
    }

    if (newAndroidVersion !== currentVersions.androidVersion) {
      newAndroidBuildNumber++;
    }
    if (newIosVersion !== currentVersions.iosVersion) {
      newIosBuildNumber++;
    }
  } else {
    if (opts.bumpBuildNumber !== 'ios') {
      newAndroidBuildNumber++;
    }

    if (opts.bumpBuildNumber !== 'android') {
      newIosBuildNumber++;
    }
  }
} else {
  const oldApp = JSON.parse(execSync('git show HEAD:app.json'));

  if (!validateVersionObject(oldApp.version)) {
    console.error('error: invalid version structure in uncommitted app.json');
    process.exit(1);
  }

  if (detectOtherChanges(app, oldApp)) {
    console.error("error: some field(s) other than 'version' have been changed inside app.json");
    process.exit(1);
  }

  const uatChanged = !compareObjects(app.version.uat, oldApp.version.uat);
  const prodChanged = !compareObjects(app.version.prod, oldApp.version.prod);

  if (uatChanged && prodChanged) {
    console.error("error: more than one flavor have been changed in app.json's version field");
    process.exit(1);
  }

  flavor = uatChanged ? 'uat' : 'prod';
  const newVersions = app.version[flavor];
  newAndroidVersion = newVersions.androidVersion;
  newIosVersion = newVersions.iosVersion;
  newAndroidBuildNumber = newVersions.androidBuildNumber;
  newIosBuildNumber = newVersions.iosBuildNumber;

  app = oldApp;
  currentVersions = app.version[flavor];
}

if (!semver.valid(newAndroidVersion)) {
  console.error('error: invalid android version: ' + newAndroidVersion);
  process.exit(1);
}

if (!semver.valid(newIosVersion)) {
  console.error('error: invalid ios version: ' + newIosVersion);
  process.exit(1);
}

if (
  !(
    Number.isInteger(newAndroidBuildNumber) &&
    newAndroidBuildNumber > 0 &&
    newAndroidBuildNumber <= 2100000000
  )
) {
  console.error('error: invalid android build number: ' + newAndroidBuildNumber);
  process.exit(1);
}

if (!(Number.isInteger(newIosBuildNumber) && newIosBuildNumber > 0)) {
  console.error('error: invalid ios build number: ' + newIosBuildNumber);
  process.exit(1);
}

const newVersions = {
  androidVersion: newAndroidVersion,
  androidBuildNumber: newAndroidBuildNumber,
  iosVersion: newIosVersion,
  iosBuildNumber: newIosBuildNumber,
};
if (compareObjects(currentVersions, newVersions)) {
  console.log('warning: no version changes detected');
  process.exit();
}

let changedPlatform;
if (semver.lt(newAndroidVersion, currentVersions.androidVersion)) {
  const allowToContinue = readlineSync
    .question(
      `New android version (${newAndroidVersion}) is smaller than the current android version (${currentVersions.androidVersion}), continue? [y/N] `,
    )
    .trim();

  if (allowToContinue !== 'y') {
    process.exit(0);
  }

  changedPlatform = 'android';
}
if (newAndroidBuildNumber < currentVersions.androidBuildNumber) {
  const allowToContinue = readlineSync
    .question(
      `New android build number (${newAndroidBuildNumber}) is smaller than the current android build number (${currentVersions.androidBuildNumber}), continue? [y/N] `,
    )
    .trim();

  if (allowToContinue !== 'y') {
    process.exit(0);
  }

  changedPlatform = 'android';
}
if (semver.lt(newIosVersion, currentVersions.iosVersion)) {
  const allowToContinue = readlineSync
    .question(
      `New ios version (${newIosVersion}) is smaller than the current ios version (${currentVersions.iosVersion}), continue? [y/N] `,
    )
    .trim();

  if (allowToContinue !== 'y') {
    process.exit(0);
  }

  changedPlatform = changedPlatform === undefined ? 'ios' : '';
}
if (newIosBuildNumber < currentVersions.iosBuildNumber) {
  const allowToContinue = readlineSync
    .question(
      `New ios build number (${newIosBuildNumber}) is smaller than the current ios build number (${currentVersions.iosBuildNumber}), continue? [y/N] `,
    )
    .trim();

  if (allowToContinue !== 'y') {
    process.exit(0);
  }

  changedPlatform = changedPlatform === 'android' || changedPlatform === '' ? '' : 'ios';
}

const newVersion = changedPlatform === 'android' ? newAndroidVersion : newIosVersion;
const newBuildNumber = changedPlatform === 'android' ? newAndroidBuildNumber : newIosBuildNumber;
const flavorName = flavor === 'uat' ? 'UAT' : 'Production';

let message = `update ${flavorName} ${
  changedPlatform ? changedPlatform + ' ' : ''
}to v${newVersion} (${newBuildNumber})`;
let tagName = `v${newVersion}/${newBuildNumber}${flavor === 'uat' ? '-uat' : ''}${
  changedPlatform ? '(' + changedPlatform + ')' : ''
}`;

currentVersions.androidVersion = newAndroidVersion;
currentVersions.iosVersion = newIosVersion;
currentVersions.androidBuildNumber = newAndroidBuildNumber;
currentVersions.iosBuildNumber = newIosBuildNumber;

const androidFlavor = flavor === 'uat' ? ANDROID_UAT_FLAVOR : ANDROID_PROD_FLAVOR;
const iosTarget = flavor === 'uat' ? IOS_UAT_TARGET : IOS_PROD_TARGET;

const packageVersion =
  semver.gt(app.version['prod'].androidVersion, app.version['prod'].iosVersion) ?
    app.version['prod'].androidVersion
  : app.version['prod'].iosVersion;

(async () => {
  fs.writeFileSync('app.json', JSON.stringify(app, null, 2) + '\n');

  if (pkg.version !== packageVersion) {
    pkg.version = packageVersion;
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  }

  execSync(
    `yarn react-native-version -A -t android -v "${newAndroidVersion}" -s "${newAndroidBuildNumber}" -f "${androidFlavor}"`,
  );
  execSync(
    `yarn react-native-version -A -t ios -v "${newIosVersion}" -s "${newIosBuildNumber}" -o "${iosTarget}"`,
  );

  execSync('git add -u app.json package.json android/ ios/');

  try {
    execSync(`git commit --allow-empty -m "${message}"`);
  } catch (e) {
    execSync('git reset app.json package.json android/ ios/');
    throw e;
  }

  try {
    execSync(`git tag -a "${tagName}" HEAD -m "${message}"`);
  } catch (e) {
    execSync('git reset HEAD~1');
    throw e;
  }
})();

function validateVersionObject(version) {
  const flavors = ['uat', 'prod'];

  for (const flavor of flavors) {
    if (!version?.[flavor]) return false;
    if (typeof version[flavor].androidVersion !== 'string') return false;
    if (typeof version[flavor].iosVersion !== 'string') return false;
    if (typeof version[flavor].androidBuildNumber !== 'number') return false;
    if (typeof version[flavor].iosBuildNumber !== 'number') return false;
  }

  return true;
}

function detectOtherChanges(app, oldApp) {
  const clonedApp = JSON.parse(JSON.stringify(app));
  const clonedOldApp = JSON.parse(JSON.stringify(oldApp));
  delete clonedApp.version;
  delete clonedOldApp.version;

  return JSON.stringify(clonedApp) !== JSON.stringify(clonedOldApp);
}

// Taken from https://stackoverflow.com/a/71131092
function compareObjects(o1, o2) {
  const normalizedObj1 = Object.fromEntries(
    Object.entries(o1).sort(([k1], [k2]) => k1.localeCompare(k2)),
  );
  const normalizedObj2 = Object.fromEntries(
    Object.entries(o2).sort(([k1], [k2]) => k1.localeCompare(k2)),
  );
  return JSON.stringify(normalizedObj1) === JSON.stringify(normalizedObj2);
}
