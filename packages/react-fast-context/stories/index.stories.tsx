import { title } from '@passionware/storybook.macro';
import { useCreateStore } from '../src/useCreateStore';
import React, { useMemo } from 'react';
import { Store, StoreContext } from '../src';
import { defaultState } from './store';
import { App } from './App';
import { ApiContext, TodoApi } from './api';

export default { title };

export const Default = () => {
  const store = useCreateStore(defaultState);
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
    }),
    [store]
  );

  return (
    <StoreContext.Provider value={store as Store<unknown>}>
      <ApiContext.Provider value={api}>
        <App />
      </ApiContext.Provider>
    </StoreContext.Provider>
  );
};
