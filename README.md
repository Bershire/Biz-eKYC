# My T-connect

## Requirements

- NodeJS 20.11.0 or above: [https://nodejs.org/en/](https://nodejs.org/en/).
- Yarn: [https://yarnpkg.com/](https://yarnpkg.com/).

## Run project

```bash
git clone $gitlink
cd $projdir
yarn
```

<br/>

### Run Android

```bash
yarn and
```

### Run Ios

```bash
yarn ios
```

<br/>

### Build Android

```bash
yarn andb
```

### Build Ios

```bash
yarn iosb
```

See more commands in `package.json`.

## Project structure

TBA

## Build Android in dev/uat mode

yarn andb

## Build Android in live/prod mode

yarn andpb

## Build iOS in dev/uat mode

Execute ios/TConnect.xcworkspace
Be sure to Clean Build Folder before running (Cmd + Shift + K)
Under scheme -> Development -> Run
When successfully run in device/simulator, choose Product/Archive
When successfully archived, choose Distribute App -> Release Testing or App Store Connect.

## Build iOS in live/prod mode

Execute ios/TConnect.xcworkspace
Be sure to Clean Build Folder before running (Cmd + Shift + K)
Under scheme -> Production -> Run
When successfully run in device/simulator, choose Product/Archive
When successfully archived, choose Distribute App -> Release Testing or App Store Connect.
