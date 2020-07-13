export type Subscriber<T> = (state: T) => void;

export interface Store<T> {
  subscribe: (subscriber: Subscriber<T>) => () => void;
  replace: (state: T) => void;
  getState: () => T;
}
