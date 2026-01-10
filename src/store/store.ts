import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth';

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
  },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
