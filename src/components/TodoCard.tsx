import { cn } from 'cn';
import { lightFormat } from 'date-fns';
import { CalendarIcon, CheckIcon, CircleCheck, EditIcon, InfoIcon } from 'lucide-react';
import React from 'react';
import { ArrowTurnDownLeftIcon } from '../assets/icons/ArrowTurnDownLeftIcon';
import { TrashIcon } from '../assets/icons/TrashIcon';
import { todoSchema, type Todo } from '../lib/todo-schema';
import { Button } from './ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { DatePicker } from './ui/date-picker';
import { Input } from './ui/input';
import { Marker, MarkerContent, MarkerIcon } from './ui/marker';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './ui/popover';
import { Textarea } from './ui/textarea';

interface TodoCardProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (updatedTodo: Todo) => void;
}

export const TodoCard = ({ todo, onToggle, onDelete, onEdit }: TodoCardProps) => {
  const [editing, setEditing] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleDeadlineChange = (date: Date | undefined) => {
    const result = todoSchema.shape.deadline.safeParse(date);
    const message = result.success ? '' : result.error.issues[0].message;
    setErrors((current) => ({ ...current, deadline: message }));
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const timeString = data.get('time') ? String(data.get('time')) : '00:00';

    const result = todoSchema.safeParse({
      ...todo,
      title: String(data.get('title')),
      description: String(data.get('description')) || '',
      deadline: data.get('deadline')
        ? new Date(`${data.get('deadline')}T${timeString}`)
        : undefined,
      time: String(data.get('time')) || undefined,
    });

    if (!result.success) {
      setErrors((current) => {
        const next: Record<string, string> = {};
        for (const issue of result.error.issues) {
          next[String(issue.path[0])] ??= issue.message;
        }
        return { ...current, ...next };
      });
      return;
    }

    onEdit(result.data);
    setErrors({});
    setEditing(false);
  };

  return (
    <Card>
      <form noValidate onSubmit={handleEdit} className="w-full">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            {editing ? (
              <span className="flex flex-col">
                <Input
                  aria-invalid={!!errors.title}
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  defaultValue={todo.title}
                />
                {errors.title && (
                  <p id="title-error" className="mt-1 text-sm text-destructive">
                    {errors.title}
                  </p>
                )}
              </span>
            ) : (
              todo.title
            )}
          </CardTitle>
          <CardAction className="flex gap-2">
            <Button
              disabled={editing}
              variant="outline"
              size="icon"
              onClick={onToggle}
              aria-label={`Mark "${todo.title}" as ${todo.completed ? 'undo complete' : 'complete task'}`}
            >
              {todo.completed ? <ArrowTurnDownLeftIcon className="size-4" /> : <CheckIcon />}
            </Button>
            {!todo.completed && (
              <Button
                disabled={editing}
                variant="outline"
                size="icon"
                onClick={() => setEditing(true)}
                aria-label={`Edit "${todo.title}"`}
              >
                <EditIcon className="size-4" />
              </Button>
            )}
            {todo.completed ? (
              <Button
                disabled={editing}
                variant="outline"
                size="icon"
                onClick={onDelete}
                aria-label={`Delete "${todo.title}"`}
              >
                <TrashIcon className="size-4" />
              </Button>
            ) : (
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      disabled={editing}
                      variant="outline"
                      size="icon"
                      aria-label={`Delete "${todo.title}"`}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  }
                />
                <PopoverContent align="center">
                  <PopoverHeader>
                    <PopoverTitle>Delete this task?</PopoverTitle>
                    <PopoverDescription>This task is not completed yet.</PopoverDescription>
                  </PopoverHeader>
                  <Button variant="destructive" size="sm" onClick={onDelete}>
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </CardAction>
          <CardDescription className="py-2">
            {editing ? (
              <Textarea
                id="description"
                name="description"
                placeholder="Description"
                defaultValue={todo.description}
              />
            ) : todo.description ? (
              todo.description
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <Marker variant={todo.deadline || editing ? 'border' : 'default'}>
            <MarkerIcon>
              {todo.completed ? (
                <CircleCheck className="size-4 text-green-600" />
              ) : (
                <CalendarIcon />
              )}
            </MarkerIcon>
            <MarkerContent>
              <span className="flex items-center gap-4">
                {lightFormat(todo.timestamp, 'dd/MM/yyyy, hh:mm aaaa')}
              </span>
            </MarkerContent>
          </Marker>
          {(todo.deadline || editing) && (
            <Marker className="items-center flex" variant={editing ? 'border' : 'default'}>
              <MarkerIcon>
                <InfoIcon />
              </MarkerIcon>
              <MarkerContent
                className={cn('text-right flex gap-2', todo.completed && 'line-through')}
              >
                {editing ? (
                  <span className="flex gap-2">
                    <DatePicker
                      id="deadline"
                      name="deadline"
                      label="Deadline"
                      hiddenLabel
                      defaultValue={todo.deadline}
                      placeholder="Select a deadline"
                      error={errors.deadline}
                      onChange={handleDeadlineChange}
                    />
                    <Input
                      className="bg-white"
                      id="time"
                      name="time"
                      type="time"
                      defaultValue={todo.time}
                    />
                  </span>
                ) : (
                  todo.deadline && (
                    <>
                      Due{' '}
                      {lightFormat(
                        todo.deadline,
                        todo.time ? 'dd/MM/yyyy, hh:mm aaaa' : 'MM/dd/yyyy',
                      )}
                    </>
                  )
                )}
              </MarkerContent>
            </Marker>
          )}
          {editing && (
            <Marker>
              <div>
                <Button type="submit" variant="default" size="sm">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(false)}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </div>
            </Marker>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};
