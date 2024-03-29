import { configureStore } from '@reduxjs/toolkit'
import themeReducer  from './slices/theme.slice'
import topDexfundsReducer  from './slices/top_dexfunds.slice';
import allFundsReducer from './slices/all_dexfunds.slice';
import monthlyEthPricesReducer from './slices/ethPrices.slice';
import assetsReducer from './slices/assets.slice';
import currencyReducer from './slices/currency.slice';
import accountReducer from './slices/accountSlice';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    topDexfunds: topDexfundsReducer,
    allFunds: allFundsReducer,
    monthlyEthPrices: monthlyEthPricesReducer,
    assets: assetsReducer,
    currency: currencyReducer,
    account: accountReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;