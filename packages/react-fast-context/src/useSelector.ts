import { useLayoutEffect, useReducer, useRef } from 'react';
import { useStore } from './useStore';

type Comparator = <T>(a: T, b: T) => boolean;
const strictEqual: Comparator = <T>(a: T, b: T) => a === b;

type Selector<State, SelectedState> = (state: State) => SelectedState;
export const useSelector = <State, SelectedState>(selector: Selector<State, SelectedState>, comparator: Comparator = strictEqual) => {
  const [, forceRender] = useReducer((s: number) => s + 1, 0);
  const store = useStore<State>();

  const latestValueRef = useRef<SelectedState>();
  const latestSelectorRef = useRef<Selector<State, SelectedState>>();
  const latestComparatorRef = useRef<Comparator>();

  latestComparatorRef.current = comparator;

  if (selector !== latestSelectorRef.current) {
    latestValueRef.current = selector(store.getState());
    latestSelectorRef.current = selector;
  }

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(originalState => {
      const selectedState = latestSelectorRef.current?.(originalState);
      if (!latestComparatorRef.current!(latestValueRef.current, selectedState)) {
        latestValueRef.current = selectedState;
        forceRender();
      }
    });

    return () => unsubscribe();
  }, [comparator, forceRender, store]);

  return latestValueRef.current;
};
