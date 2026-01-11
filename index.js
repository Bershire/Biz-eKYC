/**
 * @format
 */
import 'intl-pluralrules';

import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { name as appName } from './app.json';
import App from './src/App';

if (__DEV__) {
  require("./ReactotronConfig");
}

AppRegistry.registerComponent(appName, () => App);
