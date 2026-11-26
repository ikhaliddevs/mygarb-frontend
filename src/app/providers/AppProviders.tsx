import { useEffect, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { store, type AppStore } from '@/app/store';

export function AppProviders({
  children,
  appStore = store,
}: PropsWithChildren<{ appStore?: AppStore }>) {
  useEffect(() => setupListeners(appStore.dispatch), [appStore]);
  return <Provider store={appStore}>{children}</Provider>;
}
