import { Draft } from 'immer';

export type Subscriber<T> = (state: T) => void;

export interface Store<T> {
  subscribe: (subscriber: Subscriber<T>) => () => void;
  update: (updater: (draftState: Draft<T>) => void) => void;
  replace: (state: T) => void;
  getState: () => T;
}
