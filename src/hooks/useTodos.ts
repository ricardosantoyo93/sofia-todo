'use client';

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

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function getServerSnapshot() {
  return '';
}

function parseTodos(raw: string): Todo[] {
  if (!raw) return [];
  try {
    const result = storedTodosSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // storage unavailable or full
  }
  listeners.forEach((listener) => listener());
}

export function useTodos() {
  const raw = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const todos = React.useMemo(() => parseTodos(raw), [raw]);

  const addTodo = React.useCallback((todo: Todo) => {
    saveTodos([...parseTodos(getSnapshot()), todo]);
  }, []);

  const toggleTodo = React.useCallback((id: string) => {
    saveTodos(
      parseTodos(getSnapshot()).map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const deleteTodo = React.useCallback((id: string) => {
    saveTodos(parseTodos(getSnapshot()).filter((todo) => todo.id !== id));
  }, []);

  return { todos, addTodo, toggleTodo, deleteTodo };
}
