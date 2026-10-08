import { configureStore } from '@reduxjs/toolkit';
import converterReducer from './converterSlice';
import historyReducer from './historySlice';
import ratesReducer from './ratesSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    rates: ratesReducer,
    converter: converterReducer,
    history: historyReducer,
    settings: settingsReducer,
  },
});
