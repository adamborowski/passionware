# react-fast-context

> Minimal, efficient and context based state management for React

[![NPM](https://img.shields.io/npm/v/react-fast-context.svg)](https://www.npmjs.com/package/react-fast-context) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This library is a small addition to react context state management.
The aim of `react-fast-context` if to expose simple API that is similar to just `useState()` and `useContext()`
but keeping the performance of context consumers.

`react-fast-context` is like `react-redux` but without `redux`.

## Install

```bash
npm install --save react-fast-context
```

## Usage

### How to create store

You can use `createStore()` to create new store instance, or `useCreateStore()`
hook to create and access it directly in the component.

Once you have store instance, simply pass it to react context using `StoreContext.Provider`.

```jsx
import { useCreateStore, StoreContext } from '@passionware/react-fast-context';

const defaultState = {
  todos: [
    { id: 0, name: 'Buy coffee' },
    { id: 1, name: 'Buy bananas' },
    { id: 2, name: 'Feed a dog' },
  ],
  counter: 0,
};

const MyApp = () => {
  const store = useCreateStore(defaultState);

  return <StoreContext.Provider value={store}>your application</StoreContext.Provider>;
};
```

### Accessing the store

You can efficiently bind any component to any part of state by using selector functions,
exactly the same as you do it in `redux`. `useSelector(selector)` hook will return fresh result of `selector`.
It also triggers re-render of the component every time store is updated and selector value changes.

```jsx
import { useSelector } from '@passionware/react-fast-context';

const selectTodo = (state, id) => state.todos.find(todo => todo.id === id);

const TodoViewer = ({ id }) => {
  const selectCurrentTodo = useCallback(state => selectTodo(state, id), [id]);
  const item = useSelector(selectCurrentTodo);

  return <li>I am item {item.label}</li>;
};
```

### Updating the state

`react-fast-context` isn't opinionated about how to perform modifications.
You can update the store using `store.update()` function that will effectively update all necessary components.

`update()` uses `immer` library to perform immutable operation on a state.

```jsx
store.update(state => {
  state.todos.find(todo => todo.id === id).completed = completed;
});
```

You can create functions that will handle business-level updates.
You have total freedom of how you pass those functions to your components.

One of possible ways of doing it is to create special react context to share them

```jsx
import { StoreContext, useCreateStore } from '@passionware/react-fast-context';
import { createContext, useMemo } from 'react';

const ApiContext = createContext();

const MyApp = () => {
  const store = useCreateStore(defaultState);

  const api = useMemo(
    () => ({
      markCompleted: (id, completed) =>
        store.update(state => {
          state.todos.find(todo => todo.id === id).completed = completed;
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
    <StoreContext.Provider value={store}>
      <ApiContext.Provider value={api}>...</ApiContext.Provider>
    </StoreContext.Provider>
  );
};

const MyButton = () => {
  const { increment } = useApi();
  return <button onClick={increment} />;
};
```

## License

MIT © [adamborowski](https://github.com/adamborowski)
