import { createContext, useContext } from 'react';

export interface TodoApi {
  markCompleted: (id: number, completed: boolean) => void;
  increment: () => void;
  updated: (componentId: string) => void;
}

export const ApiContext = createContext<TodoApi | undefined>(undefined);

export const useApi = () => {
  const api = useContext(ApiContext);
  if (!api) {
    throw new Error('You need to provide API via context');
  }
  return api;
};
