# @passionware/react-fast-context

> Minimal, efficient and context based state consumption for React

[![NPM](https://img.shields.io/npm/v/@passionware/react-fast-context.svg)](https://www.npmjs.com/package/react-fast-context) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This library is a small addition to react context state management.
The aim of `react-fast-context` if to expose simple API that is similar to just `useState()` and `useContext()`
but keeping the performance of context consumers at the same level as `react-redux` does.

`react-fast-context` is like `react-redux` but without `redux`.

## Install

```bash
npm install --save react-fast-context
```

## Usage

### How to create store

You can use `createStore()` to create new store instance, or `useStore()`
hook to create and access it directly in the component.

Once you have store instance, simply pass it to react context using `StoreProvider`.

```jsx
import { useState } from 'react';
import { useStore, StoreProvider } from '@passionware/react-fast-context';
import { useMatch } from '@reach/router';

const MyApp = () => {
  const [todos, setTodos] = useState([]);
  const [counter, setCounter] = useState(0);
  const selectedTab = useMatch('/:tab').tab;

  const store = useStore({ todos, counter, selectedTab });

  return <StoreProvider value={store}>your application</StoreProvider>;
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
The library focuses on effective state share and consumption through React context.

In contrast to `redux`, when you have to imperatively dispatch an action to mutate the state,
here you don't directly update any data, you describe state in a declarative way, the same as you would do it when simply
sharing state value via context.
To do so, you just need to pass up-to-date state to `useStore()` hook.

Thanks to that you can accept state portions from component props or hooks and send them
into application context to be consumed effectively.

    Please note that updating the state in such way causes a lot of re-renders of main component.
    You need to use `React.memo` on its children in order to block this re-rendering.
    Nested components that subscribe to store will re-render only when selected value changes.

#### Recommended way

Although `react-fast-context` is only about sharing the state,
it plays nice with different strategies of handling updates.

However, it is recommended to share update API also via react context.
Update API contains business-level functions that update original data that are composed into store state.

Example with local state and routing as a source:

```jsx
import { useState } from 'react';
import { useStore, StoreProvider } from '@passionware/react-fast-context';
import { useMatch, useLocation } from '@reach/router';
import { ApiContext } from './api';

const MyApp = () => {
  const [todos, setTodos] = useState([]);
  const [counter, setCounter] = useState(0);
  const selectedTab = useMatch('/:tab').tab;
  const location = useLocation();

  const store = useStore({ todos, counter, selectedTab });
  const api = useMemo(
    () => ({
      addTodo: todo => setTodos(todos => [...todos, todo]),
      increment: () => setCounter(counter => counter + 1),
      navigate: tab => location.push('/' + tab),
    }),
    [setTodos, setCounter]
  );

  return (
    <StoreProvider value={store}>
      <ApiContext.Provider value={api}>your application</ApiContext.Provider>
    </StoreProvider>
  );
};
```

After you share update API via context, you can easily consume it in any component:

```jsx
const AddTodoButton = () => {
  const { addTodo } = useContext(ApiContext);
  return <button onClick={() => addTodo({ name: 'new todo' })}>Add todo</button>;
};
```

## API

### createStore

It accepts initial store state and returns instance of a new store.

- `store.update()` (internal) updates the state based on passed `immer`'s producer. You can read more about producers [here](https://immerjs.github.io/immer/docs/produce).

```jsx
store.update(draftState => {
  /* you can modify draftState here */
});
```

- `store.replace()` (internal) works similar to `update` but it just replaces state with new value
- `store.getState()` (internal) returns current state value. You don't need to use it directly.
- `store.subscribe()` (internal) is used by `useSelector` to listen store changes. You don't need to use it directly.

### useStore

This hook creates the store at first component render and keeps the reference for future renders. This is just a
convenient helper to not use `createStore` directly in a component.

If the component is updated and the hook receives different state as an argument, the store will be automatically updated with that value.
This is very useful when you don't want imperatively update the state but rather build the state in a declarative way, deriving other state.

```javascript
import { useStore } from '@passionware/react-fast-context';

const MyApp = () => {
  const store = useStore(currentState);
};
```

### useSelector

```javascript
useSelector(selector, compareFunction);
```

This hook returns a selector result performed on always recent store value.
You have to remember not to re-create the selection function every render. You should create selector outside component
or use `useCallback` if a selector depends on component state / props.

There is an optional `compareFunction` if your selector computes derived data causing new value not being referentially equal.
You can read more about this in [react-redux](https://react-redux.js.org/api/hooks#equality-comparisons-and-updates) docs.

### useStoreContext

A hook to return store from a context. You don't need to use it directtly.

## License

MIT © [adamborowski](https://github.com/adamborowski)
