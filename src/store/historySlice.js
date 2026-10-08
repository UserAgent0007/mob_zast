import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
  },
  reducers: {
    addHistoryItem(state, action) {
      state.items.unshift(action.payload);
      state.items = state.items.slice(0, 40);
    },
    removeHistoryItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearHistory(state) {
      state.items = [];
    },
  },
});

export const { addHistoryItem, removeHistoryItem, clearHistory } = historySlice.actions;
export default historySlice.reducer;
