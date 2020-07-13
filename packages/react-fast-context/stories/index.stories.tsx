import { title } from '@passionware/storybook.macro';
import { useStore } from '../src/useStore';
import React, { useCallback, useMemo, useRef } from 'react';
import { Store, StoreContext } from '../src';
import { defaultState } from '../src/__test__/store';
import { App } from '../src/__test__/App';
import { ApiContext, TodoApi } from '../src/__test__/api';

export default { title };

const useActions = () => {
  const firstRenderRef = useRef(true);
  const resultRef = useRef<HTMLElement>(null);

  const addAction = useCallback((action: string) => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      if (resultRef.current) {
        resultRef.current.innerHTML = '';
      }
      setTimeout(() => {
        firstRenderRef.current = true;
      }, 0);
    }
    const element = document.createElement('div');
    element.textContent = action;
    resultRef.current?.appendChild(element);
  }, []);
  return { resultRef, addAction };
};

export const Default = () => {
  const { addAction, resultRef } = useActions();
  const store = useStore(defaultState);

  const api = useMemo<TodoApi>(
    () => ({
      markCompleted: (id, completed) =>
        store.update(state => {
          state.todos.find(todo => todo.id === id)!.completed = completed;
        }),
      increment: () =>
        store?.update(state => {
          state.counter++;
        }),
      updated: addAction,
    }),
    [store]
  );

  return (
    <StoreContext.Provider value={store as Store<unknown>}>
      <ApiContext.Provider value={api}>
        <div style={{ float: 'right' }}>
          Previously updated components:
          <pre>
            <code ref={resultRef} />
          </pre>
        </div>
        <App />
      </ApiContext.Provider>
    </StoreContext.Provider>
  );
};
