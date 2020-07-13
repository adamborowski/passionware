import { useLayoutEffect, useReducer, useRef } from 'react';
import { useStoreContext } from './useStoreContext';

export type Comparator<T> = (a: T, b: T) => boolean;
const strictEqual: Comparator<unknown> = (a, b) => a === b;

export type Selector<State, SelectedState> = (state: State) => SelectedState;

// todo document
export const createUseSelector = <T, S>(selector: (state: S) => T, comparator?: Comparator<T>) => () => useSelector(selector, comparator);

export const useSelector = <State, SelectedState>(
  selector: Selector<State, SelectedState>,
  comparator: Comparator<SelectedState> = strictEqual
): SelectedState => {
  const [, forceRender] = useReducer((s: number) => s + 1, 0);
  const store = useStoreContext<State>();

  const latestValueRef = useRef<SelectedState>();
  const latestSelectorRef = useRef<Selector<State, SelectedState>>();
  const latestComparatorRef = useRef<Comparator<SelectedState>>();

  latestComparatorRef.current = comparator;

  if (selector !== latestSelectorRef.current) {
    latestValueRef.current = selector(store.getState());
    latestSelectorRef.current = selector;
  }

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(originalState => {
      const selectedState = latestSelectorRef.current?.(originalState);
      const latestValue = latestValueRef.current;
      if (
        (latestValue === undefined) !== (selectedState === undefined) ||
        (latestValue !== undefined && selectedState !== undefined && !latestComparatorRef.current!(latestValue, selectedState))
      ) {
        latestValueRef.current = selectedState;
        forceRender();
      }
    });

    return () => unsubscribe();
  }, [comparator, forceRender, store]);

  return latestValueRef.current!;
};
