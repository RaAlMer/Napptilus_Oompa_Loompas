import { configureStore } from '@reduxjs/toolkit';
import listReducer from './features/list/listSlice';
import detailReducer from './features/detail/detailSlice';

export const store = configureStore({
  reducer: {
    list: listReducer,
    detail: detailReducer,
  },
});
