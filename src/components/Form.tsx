'use client';

import * as React from 'react';

import { parseTodoForm, validateTodoDeadline, type Todo } from '../lib/todo-schema';
import { Button } from './ui/button';
import { DatePicker } from './ui/date-picker';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface FormProps {
  onSubmit?: (todo: Todo) => void;
}

export const Form = ({ onSubmit }: FormProps) => {
  const [resetKey, setResetKey] = React.useState(0);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleDeadlineChange = (date: Date | undefined) => {
    const result = validateTodoDeadline(date);
    const message = result.success ? '' : result.error.issues[0].message;
    setErrors((current) => ({ ...current, deadline: message }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const result = parseTodoForm(data);

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        next[String(issue.path[0])] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    onSubmit?.(result.data);
    form.reset();
    setResetKey((key) => key + 1);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:col-span-2">
          Add a new task
        </h2>
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 sm:col-span-2">
          Fill out the form below to add a new task to your to-do list.
        </p>
        <div className="sm:col-span-2">
          <label
            htmlFor="title"
            className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
          >
            Title <span className="text-destructive">*</span>
          </label>
          <div className="mt-2.5">
            <Input
              required
              id="title"
              name="title"
              type="text"
              aria-invalid={!!errors.title}
              aria-describedby="title-error"
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-destructive">
                {errors.title}
              </p>
            )}
          </div>
        </div>
        <DatePicker
          key={resetKey}
          id="deadline"
          name="deadline"
          label="Deadline"
          placeholder="Select a deadline"
          error={errors.deadline}
          onChange={handleDeadlineChange}
        />
        <div>
          <label
            htmlFor="time"
            className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
          >
            Time
          </label>
          <div className="mt-2.5">
            <Input
              id="time"
              name="time"
              type="time"
              aria-invalid={!!errors.time}
              aria-describedby="time-error"
              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
            {errors.time && (
              <p id="time-error" className="mt-1 text-sm text-destructive">
                {errors.time}
              </p>
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
          >
            Description
          </label>
          <div className="mt-2.5">
            <Textarea
              id="description"
              name="description"
              rows={4}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              defaultValue={''}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          variant="default"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
        >
          Add Task
        </Button>
      </div>
    </form>
  );
};
