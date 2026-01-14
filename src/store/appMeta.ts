import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppMetaState {
  hasLaunched?: boolean;
}

const initialState: AppMetaState = {
  hasLaunched: undefined,
};

const appMetaSlice = createSlice({
  name: 'appMeta',
  initialState,
  reducers: {
    setHasLaunched: (state, action: PayloadAction<AppMetaState['hasLaunched']>) => {
      state.hasLaunched = action.payload;
    },
  },
});

export const { setHasLaunched } = appMetaSlice.actions;

export default appMetaSlice;
