import * as React from 'react';
import { z } from 'zod';

import { todoSchema, type Todo } from '../lib/todo-schema';

const STORAGE_KEY = 'todos';

const storedTodosSchema = z.array(
  todoSchema.extend({
    deadline: z.coerce.date().optional(),
    timestamp: z.coerce.date(),
  }),
);

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const result = storedTodosSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = React.useState<Todo[]>(loadTodos);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // storage unavailable or full
    }
  }, [todos]);

  const addTodo = React.useCallback((todo: Todo) => {
    setTodos((current) => [...current, todo]);
  }, []);

  const toggleTodo = React.useCallback((timestamp: Date) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.timestamp.getTime() === timestamp.getTime()
          ? { ...todo, completed: !todo.completed }
          : todo,
      ),
    );
  }, []);

  return { todos, addTodo, toggleTodo };
}
