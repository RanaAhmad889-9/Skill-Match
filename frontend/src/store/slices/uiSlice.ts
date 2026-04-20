import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  message: string;
  type: 'success' | 'error';
  id: number;
}

interface UiState {
  toast: ToastState | null;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  toast: null,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<{ message: string; type?: 'success' | 'error' }>) {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'success',
        id: Date.now(),
      };
    },
    hideToast(state) {
      state.toast = null;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { showToast, hideToast, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;