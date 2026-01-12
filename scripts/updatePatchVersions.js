/**
 * Update patch's versions to match the current package versions
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const semver = require('semver');
const { execSync } = require('child_process');

const pkg = require('../package.json');
const lockfile = yaml.load(fs.readFileSync('./yarn.lock', 'utf8'));

const patchDir = path.join(__dirname, '../.yarn/patches/');
const patchVersionRegex = /^patch:(.+?@npm%3A)(.+)?#(.+)$/;
const resolutionRegex = /^(.+?)(?:@npm:(.+))?$/;
const resolutionLockRegex = /^(.+?)@npm:(?:.+)$/;

let changed = false;
for (const depType of ['dependencies', 'devDependencies', 'resolutions']) {
  const deps = pkg[depType] ?? {};
  for (const [depName, depVersion] of Object.entries(deps)) {
    const res = patchVersionRegex.exec(depVersion);
    if (res) {
      const [_, prefix, currentVer, path] = res;
      const pathFragments = path.split('/');
      const patchFilename = pathFragments[pathFragments.length - 1];
      const filenameFragments = patchFilename.split('-');
      const patchVer = filenameFragments[filenameFragments.length - 2];

      if (depType === 'resolutions') {
        const resList = depName.split('/').map(package => {
          const [_, resName, resVer] = resolutionRegex.exec(package) ?? [];
          return { resName, resVer };
        });
        const lockVersions = findResolutionVersions(resList);
        let selectedVer = lockVersions[0];

        if (lockVersions.length > 1) {
          selectedVer = lockVersions.reduce(
            (best, version) =>
              semver.gt(semver.coerce(best), semver.coerce(version)) ? best : version,
            selectedVer,
          );

          console.warn(
            `More than one resolution targets found for '${depName}'. Go with version '${selectedVer}'. Please re-check to make sure nothing when wrong.`,
          );
        }

        if (selectedVer && currentVer !== selectedVer) {
          filenameFragments[filenameFragments.length - 2] = semver.coerce(selectedVer);
          pathFragments[pathFragments.length - 1] = filenameFragments.join('-');

          fs.renameSync(patchDir + patchFilename, patchDir + filenameFragments.join('-'));
          pkg[depType][depName] =
            'patch:' + prefix + encodeURIComponent(selectedVer) + '#' + pathFragments.join('/');
          changed = true;
        }
      } else {
        if (currentVer !== patchVer) {
          filenameFragments[filenameFragments.length - 2] = currentVer;
          pathFragments[pathFragments.length - 1] = filenameFragments.join('-');

          fs.renameSync(patchDir + patchFilename, patchDir + filenameFragments.join('-'));
          pkg[depType][depName] = 'patch:' + prefix + currentVer + '#' + pathFragments.join('/');
          changed = true;
        }
      }
    }
  }
}

if (changed) {
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  // TODO: make this into a yarn plugin so we needn't to run yarn twice
  execSync('yarn');
}

function findResolutionVersions(resList, currentIndex = 0, lockVer) {
  if (resList.length < 2) return [];

  const { resName, resVer } = resList[currentIndex] ?? {};
  const lockNextVers = [];

  for (const [resLockKey, resLockInfo] of Object.entries(lockfile)) {
    const [_, resLockName] = resolutionLockRegex.exec(resLockKey) ?? [];
    const resNextName = resList[currentIndex + 1]?.resName;
    let lockNextVer = resLockInfo.dependencies?.[resNextName];
    if (lockNextVer?.startsWith('npm:')) {
      lockNextVer = lockNextVer.substring('npm:'.length);
    } else {
      lockNextVer = undefined;
    }

    if (
      resLockName &&
      resLockName === resName &&
      lockNextVer &&
      (resVer ? semver.satisfies(resLockInfo.version, resVer) : true) &&
      (lockVer ? semver.satisfies(resLockInfo.version, lockVer) : true)
    ) {
      lockNextVers.push(lockNextVer);
    }
  }

  if (currentIndex === resList.length - 2) return lockNextVers;

  const result = [];
  for (const lockNextVer of lockNextVers) {
    result.push(...findResolutionVersions(resList, currentIndex + 1, lockNextVer));
  }

  return result;
}
