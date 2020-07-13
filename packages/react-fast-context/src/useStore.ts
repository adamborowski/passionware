import { useRef } from 'react';
import { createStore } from './createStore';
import { Store } from './types';

// todo add unit test to check if useCreateStore re-rendered updates the store
export const useStore = <T>(state: T) => {
  const store = useRef<Store<T>>();
  if (!store.current) {
    store.current = createStore(state);
  } else {
    if (store.current.getState() !== state) {
      store.current.replace(state);
    }
  }
  return store.current;
};
