import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language?: string;
}

const initialState: SettingsState = {
  language: undefined,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguageSetting: (state, action: PayloadAction<SettingsState['language']>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguageSetting } = settingsSlice.actions;

export default settingsSlice;
