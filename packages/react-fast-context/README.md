# @passionware/react-fast-context

> Minimal, efficient and context based state management for React

[![NPM](https://img.shields.io/npm/v/@passionware/react-fast-context.svg)](https://www.npmjs.com/package/react-fast-context) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This library is a small addition to react context state management.
The aim of `react-fast-context` if to expose simple API that is similar to just `useState()` and `useContext()`
but keeping the performance of context consumers at the same level as `redux` does.

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
exactly the same as you do it in `react-redux`. `useSelector(selector)` hook will return fresh result of `selector`.
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

## API

### createStore

It accepts initial store state and returns instance of a new store.

- `store.update()` updates the state based on passed `immer`'s producer. You can read more about producers [here](https://immerjs.github.io/immer/docs/produce).

```jsx
store.update(draftState => {
  /* you can modify draftState here */
});
```

- `store.getState()` returns current state value. You don't need to use it directly.
- `store.subscribe()` is used by `useSelector` to listen store changes. You don't need to use it directly.

### useCreateStore

This hook creates the store at first component render and keeps the reference for future renders. This is just a
convenient helper to not use `createStore` directly in a component.

If the component is updated and the hook receives different state as an argument, the store will be automatically updated with that value.
This is very useful when you don't want imperatively update the state but rather build the state in a declarative way, deriving other state.

```javascript
import { useCreateStore } from '@passionware/react-fast-context';

const MyApp = () => {
  const store = useCreateStore(currentState);
};
```

### useSelector

```javascript
useCallback(selector, compareFunction);
```

This hook returns a selector result performed on always recent store value.
You have to remember not to re-create the selection function every render. You should create selector outside component
or use `useCallback` if a selector depends on component state / props.

There is an optional `compareFunction` if your selector computes derived data causing new value not being referentially equal.
You can read more about this in [react-redux](https://react-redux.js.org/api/hooks#equality-comparisons-and-updates) docs.

### useStore

A hook to return store from a context. You don't need to use it directtly.

## License

MIT © [adamborowski](https://github.com/adamborowski)
