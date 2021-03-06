import React, { FC, memo, useCallback, useState } from 'react';

import { AppState } from './store';
import { useSelector } from '../index';
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

  const { updated } = useApi();

  updated('App');

  return (
    <>
      <Counter />
      <p id="info" data-info={showCompleted ? 'completed' : 'all'}>
        {showCompleted ? 'showing completed only' : 'showing all'}
      </p>
      <button id="filter-button" onClick={() => setShowCompleted(!showCompleted)}>
        {showCompleted ? 'show all' : 'show completed'}
      </button>
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

  const { updated } = useApi();

  updated('Counter');

  return (
    <button id="counter-button" data-counter={counter} onClick={increment}>
      Counter: {counter}
    </button>
  );
});

export const Item: FC<{ id: number }> = memo(({ id }) => {
  const { markCompleted } = useApi();
  const selectCurrentTodo = useCallback((state: AppState) => selectTodo(state, id), [id]);
  const item = useSelector(selectCurrentTodo);
  const { updated } = useApi();

  updated(`Item(${id})`);

  if (!item) {
    throw new Error(`Item with id ${id} not found.`);
  }

  return (
    <li id={`item-${id}`} data-type="item" data-completed={item.completed} data-id={item.id} style={{ opacity: item.completed ? 0.4 : 1 }}>
      {item.name}
      <button onClick={() => markCompleted(item.id, !item.completed)}>{item.completed ? 'uncomplete' : 'complete'}</button>
    </li>
  );
});
