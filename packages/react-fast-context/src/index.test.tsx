/**
 * This is integration test that checks if
 * updates are correct and minimal
 */

import { defaultState } from './__test__/store';
import React, { ReactElement } from 'react';
import produce from 'immer';
import { ApiContext, TodoApi } from './__test__/api';

import TestRenderer, { act } from 'react-test-renderer';
import { StoreContext } from './StoreContext';
import { Store } from './types';
import { App } from './__test__/App';
import { createStore } from './createStore';

describe('react-fast-context', () => {
  it('should render correct states and do minimal updates', () => {
    const { api, store, updates, resetUpdates } = createStoreWithApi();

    const { getSnapshot, clickCounter, toggleFilter, toggleItemComplete } = render(
      <StoreContext.Provider value={store as Store<unknown>}>
        <ApiContext.Provider value={api}>
          <App />
        </ApiContext.Provider>
      </StoreContext.Provider>
    );

    const check = (action?: () => void) => {
      void act(() => {
        action?.();
      });
      const savedUpdates = updates.slice();
      resetUpdates();
      return { snapshot: getSnapshot(), updates: savedUpdates };
    };

    // initial render
    expect(check()).toEqual({
      snapshot: 'counter=0 info=all items=[0 false][1 false][2 false]',
      updates: ['App', 'Counter', 'Item(0)', 'Item(1)', 'Item(2)'],
    });
    // click counter two times
    expect(check(clickCounter)).toEqual({
      snapshot: 'counter=1 info=all items=[0 false][1 false][2 false]',
      updates: ['Counter'],
    });
    expect(check(clickCounter)).toEqual({
      snapshot: 'counter=2 info=all items=[0 false][1 false][2 false]',
      updates: ['Counter'],
    });
    // show only completed
    expect(check(toggleFilter)).toEqual({
      snapshot: 'counter=2 info=completed items=',
      updates: ['App'],
    });
    // show all
    expect(check(toggleFilter)).toEqual({
      snapshot: 'counter=2 info=all items=[0 false][1 false][2 false]',
      updates: ['App', 'Item(0)', 'Item(1)', 'Item(2)'],
    });
    // complete all
    expect(check(() => toggleItemComplete(0))).toEqual({
      snapshot: 'counter=2 info=all items=[0 true][1 false][2 false]',
      updates: ['Item(0)'],
    });
    expect(check(() => toggleItemComplete(1))).toEqual({
      snapshot: 'counter=2 info=all items=[0 true][1 true][2 false]',
      updates: ['Item(1)'],
    });
    expect(check(() => toggleItemComplete(2))).toEqual({
      snapshot: 'counter=2 info=all items=[0 true][1 true][2 true]',
      updates: ['Item(2)'],
    });
    // uncomplete all
    expect(check(() => toggleItemComplete(0))).toEqual({
      snapshot: 'counter=2 info=all items=[0 false][1 true][2 true]',
      updates: ['Item(0)'],
    });
    expect(check(() => toggleItemComplete(1))).toEqual({
      snapshot: 'counter=2 info=all items=[0 false][1 false][2 true]',
      updates: ['Item(1)'],
    });
    expect(check(() => toggleItemComplete(2))).toEqual({
      snapshot: 'counter=2 info=all items=[0 false][1 false][2 false]',
      updates: ['Item(2)'],
    });
    // complete all at once
    expect(check(() => (toggleItemComplete(0), toggleItemComplete(1), toggleItemComplete(2)))).toEqual({
      snapshot: 'counter=2 info=all items=[0 true][1 true][2 true]',
      updates: ['Item(0)', 'Item(1)', 'Item(2)'],
    });
    // show completed
    expect(check(toggleFilter)).toEqual({
      snapshot: 'counter=2 info=completed items=[0 true][1 true][2 true]',
      updates: ['App'],
    });
    // uncomplete first one - disappear
    expect(check(() => toggleItemComplete(0))).toEqual({
      snapshot: 'counter=2 info=completed items=[1 true][2 true]',
      updates: ['App'],
    });
    // show all
    expect(check(toggleFilter)).toEqual({
      snapshot: 'counter=2 info=all items=[0 false][1 true][2 true]',
      updates: ['App', 'Item(0)'],
    });
    // click counter ten times => Counter should be re-rendered only once
    expect(check(() => new Array(10).fill(0).forEach(clickCounter))).toEqual({
      snapshot: 'counter=12 info=all items=[0 false][1 true][2 true]',
      updates: ['Counter'],
    });
    // show completed
    expect(check(toggleFilter)).toEqual({
      snapshot: 'counter=12 info=completed items=[1 true][2 true]',
      updates: ['App'],
    });
    // uncomplete 1 - disappear
    expect(check(() => toggleItemComplete(1))).toEqual({
      snapshot: 'counter=12 info=completed items=[2 true]',
      updates: ['App'],
    });
    // uncomplete 2 - disappear
    expect(check(() => toggleItemComplete(2))).toEqual({
      snapshot: 'counter=12 info=completed items=',
      updates: ['App'],
    });
  });
});

const render = (element: ReactElement) => {
  const wrapper = TestRenderer.create(element);

  const getCounter = () => Number(wrapper.root.findByProps({ id: 'counter-button' }).props['data-counter']);
  const getInfo = () => String(wrapper.root.findByProps({ id: 'info' }).props['data-info']);
  const getItems = () =>
    wrapper.root
      .findAllByProps({ 'data-type': 'item' })
      .map(item => ({ id: Number(item.props['data-id']), completed: Boolean(item.props['data-completed']) }));

  return {
    getSnapshot: () =>
      `counter=${getCounter()} info=${getInfo()} items=${getItems()
        .map(item => `[${item.id} ${String(item.completed)}]`)
        .join('')}`,
    clickCounter: () => {
      wrapper.root.findByProps({ id: 'counter-button' }).props.onClick();
    },
    toggleFilter: () => {
      wrapper.root.findByProps({ id: 'filter-button' }).props.onClick();
    },
    toggleItemComplete: (id: number) => {
      wrapper.root
        .findByProps({ id: `item-${id}` })
        .findByType('button')
        .props.onClick();
    },
  };
};

const createStoreWithApi = () => {
  const store = createStore(defaultState);
  const updates: string[] = [];

  const api: TodoApi = {
    markCompleted: (id, completed) =>
      store.replace(
        produce(store.getState(), state => {
          state.todos.find(todo => todo.id === id)!.completed = completed;
        })
      ),
    increment: () =>
      store?.replace(
        produce(store.getState(), state => {
          state.counter++;
        })
      ),
    updated: id => updates.push(id),
  };

  const resetUpdates = () => updates.splice(0, updates.length);

  return { api, store, updates, resetUpdates };
};
