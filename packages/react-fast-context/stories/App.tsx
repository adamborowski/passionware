import React, { FC, memo, useCallback, useState } from 'react';

import { AppState } from './store';
import { useSelector } from '../src';
import { useApi } from './api';

const selectTodos = (state: AppState) => state.todos;
const selectTodo = (state: AppState, id: number) => selectTodos(state).find(todo => todo.id === id);

const arrayEqual = (a: unknown[], b: unknown[]) => a.length === b.length && a.every((item, index) => item === b[index]);

export const App: FC = () => {
  const [showCompleted, setShowCompleted] = useState(false); // let's say some data come from outside

  const selectCurrentTodos = useCallback(
    (state: AppState) =>
      selectTodos(state)
        .filter(todo => !showCompleted || todo.completed)
        .map(t => t.id),
    [showCompleted]
  );
  const todos = useSelector(selectCurrentTodos, arrayEqual);

  console.log('updated');

  return (
    <>
      <Counter />
      {showCompleted ? 'showing completed only' : 'showing all'}
      <button onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? 'show all' : 'show completed'}</button>
      <ul>
        {todos.map(id => (
          <Item key={id} id={id} />
        ))}
      </ul>
    </>
  );
};

export const Counter = memo(() => {
  const selectCounter = useCallback((state: AppState) => state.counter, []);
  const { increment } = useApi();
  const counter = useSelector(selectCounter);

  console.log('counter render');

  return <button onClick={increment}>Counter: {counter}</button>;
});

export const Item: FC<{ id: number }> = ({ id }) => {
  const { markCompleted } = useApi();
  const selectCurrentTodo = useCallback((state: AppState) => selectTodo(state, id), [id]);
  const item = useSelector(selectCurrentTodo);
  console.log(`Item ${id} render`);

  return (
    <li style={{ opacity: item.completed ? 0.4 : 1 }}>
      {item.name}
      <button onClick={() => markCompleted(item.id, !item.completed)}>{item.completed ? 'uncomplete' : 'complete'}</button>
    </li>
  );
};
