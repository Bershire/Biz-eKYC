import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UIState {
  headerHeight?: number;
  modalIdCounter: number;
  openModalOrder: number[];
  openModals: number;
}

const initialState: UIState = {
  modalIdCounter: 0,
  openModalOrder: [],
  openModals: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setHeaderHeight: (state, action: PayloadAction<number>) => {
      state.headerHeight = action.payload;
    },
    setOpenModal: (state, action: PayloadAction<number>) => {
      state.openModals = state.openModals + 1;
      state.openModalOrder.push(action.payload);
      state.modalIdCounter = action.payload;
    },
    setCloseModal: (state, action: PayloadAction<number>) => {
      state.openModals = state.openModals - 1;
      state.openModalOrder = state.openModalOrder.filter(id => id !== action.payload);
    },
  },
  selectors: {
    selectHeaderHeight: state => state.headerHeight,
    selectIsAnyModalOpen: state => !!state.openModals,
  },
});

export const { setHeaderHeight, setOpenModal, setCloseModal } = uiSlice.actions;
export const { selectHeaderHeight, selectIsAnyModalOpen } = uiSlice.selectors;

export default uiSlice;
