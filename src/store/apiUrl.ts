import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ApiUrlState {
  url?: string;
}

const initialState: ApiUrlState = {
  url: undefined,
};

const apiUrlSlice = createSlice({
  name: 'apiUrl',
  initialState,
  reducers: {
    setApiUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
  },
});

export const { setApiUrl } = apiUrlSlice.actions;

export default apiUrlSlice;
