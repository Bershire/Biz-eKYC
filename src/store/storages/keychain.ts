import {
  getGenericPassword,
  resetGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';
import { Storage } from 'redux-persist';

const keychainStorage: Storage = {
  setItem: async (key, value) => {
    try {
      return !!(await setGenericPassword('user', `${value}`, { service: key }));
    } catch {
      await resetGenericPassword({ service: key });
      try {
        return !!(await setGenericPassword('user', `${value}`, { service: key }));
      } catch {
        return false;
      }
    }
  },
  getItem: async key => {
    try {
      const res = await getGenericPassword({ service: key });
      if (res === false) return;

      return res.password;
    } catch {
      await resetGenericPassword({ service: key });
      return;
    }
  },
  removeItem: async key => resetGenericPassword({ service: key }),
};

export default keychainStorage;
