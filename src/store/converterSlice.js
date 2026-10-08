import { createSlice } from '@reduxjs/toolkit';

const converterSlice = createSlice({
  name: 'converter',
  initialState: {
    from: 'UAH',
    to: 'USD',
    amount: '1000',
  },
  reducers: {
    setAmount(state, action) {
      state.amount = action.payload;
    },
    setFrom(state, action) {
      const next = action.payload;
      if (next === state.to) {
        state.to = state.from;
      }
      state.from = next;
    },
    setTo(state, action) {
      const next = action.payload;
      if (next === state.from) {
        state.from = state.to;
      }
      state.to = next;
    },
    setPair(state, action) {
      state.from = action.payload.from;
      state.to = action.payload.to;
      if (action.payload.amount != null) {
        state.amount = String(action.payload.amount);
      }
    },
    swapCurrencies(state) {
      const previousFrom = state.from;
      state.from = state.to;
      state.to = previousFrom;
    },
  },
});

export const { setAmount, setFrom, setTo, setPair, swapCurrencies } = converterSlice.actions;
export default converterSlice.reducer;
