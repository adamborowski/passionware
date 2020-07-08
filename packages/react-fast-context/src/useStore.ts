import { useContext } from 'react';
import { StoreContext } from './StoreContext';
import { Store } from './types';

export const useStore = <T>(): Store<T> => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('You need to provide store via context in order to use it');
  }
  return store as Store<T>;
};
