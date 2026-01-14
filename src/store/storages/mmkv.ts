import { MMKV } from 'react-native-mmkv';
import { Storage } from 'redux-persist';

const storage = new MMKV();
const mmkvStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, isValidMmkvValue(value) ? value : `${value}`);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const isValidMmkvValue = (value: unknown): value is string | number | boolean | Uint8Array => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value instanceof Uint8Array
  );
};

export default mmkvStorage;
