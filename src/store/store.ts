import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { api, externalApi } from '../services/api';
import apiUrlSlice from './apiUrl';
import appMetaSlice from './appMeta';
import authSlice from './auth';
import personalInfoSlice from './personalInfo';
import settingsSlice from './settings';
import keychainStorage from './storages/keychain';
import mmkvStorage from './storages/mmkv';
import uiSlice from './ui';
import { extractReduxPersistState } from './utils/extractReduxPersistState';

const authReducer = persistReducer(
  {
    key: 'auth',
    storage: keychainStorage,
    timeout: 0, // 0 means infinite timeout
  },
  authSlice.reducer,
);

const reducers = combineReducers({
  // Slices
  [authSlice.name]: authReducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [personalInfoSlice.name]: personalInfoSlice.reducer,
  [apiUrlSlice.name]: apiUrlSlice.reducer,
  [uiSlice.name]: uiSlice.reducer,
  [appMetaSlice.name]: appMetaSlice.reducer,

  // APIs
  [api.reducerPath]: api.reducer,
  [externalApi.reducerPath]: externalApi.reducer,
});

const persistedReducer = persistReducer<ReturnType<typeof reducers>>(
  {
    key: 'root',
    storage: mmkvStorage,
    whitelist: [settingsSlice.name, appMetaSlice.name, personalInfoSlice.name],
    stateReconciler: autoMergeLevel2,
    timeout: 0, // 0 means infinite timeout
  },
  reducers,
);

const rootReducer: typeof persistedReducer = (state, action) => {
  // Reset the store when logging out
  // eslint-disable-next-line unicorn/prefer-regexp-test -- See: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1677
  if (authSlice.actions.logout.match(action) && state) {
    state = {
      ...extractReduxPersistState(state),
      [apiUrlSlice.name]: state[apiUrlSlice.name],
      [settingsSlice.name]: state[settingsSlice.name],
      [appMetaSlice.name]: state[appMetaSlice.name],
      [uiSlice.name]: state[uiSlice.name],
    } as typeof state;
  }

  return persistedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 200,
      },
    })
      .concat(api.middleware)
      .concat(externalApi.middleware)
  },
});

const persistor = persistStore(store);

// required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export { persistor, store };

// Infer the `RootState`, `AppDispatch` and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
