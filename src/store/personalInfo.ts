import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfoState {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
}

const initialState: PersonalInfoState = {
  fullName: 'John Doe',
  email: 'johndoe1999@gmail.com',
  phone: '0987329382',
  dob: '17/09/1999',
};

const personalInfoSlice = createSlice({
  name: 'personalInfo',
  initialState,
  reducers: {
    setPersonalInfo: (_state, action: PayloadAction<PersonalInfoState>) => {
      return action.payload;
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfoState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setPersonalInfo, updatePersonalInfo } = personalInfoSlice.actions;

export default personalInfoSlice;
