import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@/app/rootReducer';
import { baseApi } from '@/services/api/baseApi';

export function createAppStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    devTools: import.meta.env.DEV,
  });
}

export const store = createAppStore();
export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
