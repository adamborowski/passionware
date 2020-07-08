import { useRef } from 'react';
import { createStore } from './createStore';
import { Store } from './types';

export const useCreateStore = <T>(initialState: T) => {
  const store = useRef<Store<T>>();
  if (!store.current) {
    store.current = createStore(initialState);
  }
  return store.current;
};
