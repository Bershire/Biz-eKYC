import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  token?: string | undefined | null;
  refreshToken?: string | undefined | null;
}

const initialState: AuthState = {
  token: undefined,
  refreshToken: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuthState: (_state, action: PayloadAction<AuthState>) => {
      return action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
  selectors: {
    selectToken: state => state.token,
  },
});

export const { updateAuthState, logout } = authSlice.actions;
export const { selectToken } = authSlice.selectors;

export default authSlice;
