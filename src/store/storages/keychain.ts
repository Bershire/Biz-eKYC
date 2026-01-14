import {
  getGenericPassword,
  resetGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';
import { Storage } from 'redux-persist';

const keychainStorage: Storage = {
  setItem: async (key, value) => {
    return !!(await setGenericPassword('user', `${value}`, { service: key }));
  },
  getItem: async key => {
    const res = await getGenericPassword({ service: key });
    if (res === false) return;

    return res.password;
  },
  removeItem: async key => resetGenericPassword({ service: key }),
};

export default keychainStorage;
