import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_FAVORITES } from '../data/currencies';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    decimals: 2,
    displayBase: 'UAH',
    favorites: DEFAULT_FAVORITES,
  },
  reducers: {
    setDecimals(state, action) {
      state.decimals = action.payload;
    },
    setDisplayBase(state, action) {
      state.displayBase = action.payload;
    },
    toggleFavorite(state, action) {
      const code = action.payload;
      if (state.favorites.includes(code)) {
        if (state.favorites.length > 1) {
          state.favorites = state.favorites.filter((item) => item !== code);
        }
        return;
      }
      state.favorites.push(code);
    },
  },
});

export const { setDecimals, setDisplayBase, toggleFavorite } = settingsSlice.actions;
export default settingsSlice.reducer;
