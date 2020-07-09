export interface TodoItem {
  completed?: boolean;
  name: string;
  id: number;
}

export interface AppState {
  todos: TodoItem[];
  counter: number;
}

export const defaultState: AppState = {
  todos: [
    { id: 0, name: 'Buy coffee' },
    { id: 1, name: 'Buy bananas' },
    { id: 2, name: 'Feed a dog' },
  ],
  counter: 0,
};
