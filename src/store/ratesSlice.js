import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchLatestRates } from '../api/rates';

export const loadRates = createAsyncThunk('rates/load', async (base, { rejectWithValue }) => {
  try {
    return await fetchLatestRates(base || 'USD');
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const ratesSlice = createSlice({
  name: 'rates',
  initialState: {
    base: 'USD',
    rates: {},
    updatedAt: null,
    provider: '',
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRates.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadRates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.base = action.payload.base;
        state.rates = action.payload.rates;
        state.updatedAt = action.payload.updatedAt;
        state.provider = action.payload.provider;
      })
      .addCase(loadRates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Невідома помилка завантаження курсів.';
      });
  },
});

export default ratesSlice.reducer;
