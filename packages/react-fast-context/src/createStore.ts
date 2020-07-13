import { Store, Subscriber } from './types';

export const createStore: <T>(initialState: T) => Store<T> = <T>(initialState: T) => {
  let state = initialState;
  const subscribers = new Set<Subscriber<T>>();

  const subscribe = (subscriber: Subscriber<T>) => {
    subscribers.add(subscriber);

    return () => {
      subscribers.delete(subscriber);
    };
  };

  const replace = (newState: T) => {
    state = newState;
    subscribers.forEach(subscriber => subscriber(state));
  };

  const getState = () => state;

  return { subscribe, getState, replace };
};
