import { cn } from 'cn';
import { lightFormat } from 'date-fns';
import { CalendarIcon, CheckIcon, CircleCheck, InfoIcon } from 'lucide-react';
import { ArrowTurnDownLeftIcon } from '../assets/icons/ArrowTurnDownLeftIcon';
import { TrashIcon } from '../assets/icons/TrashIcon';
import type { Todo } from '../lib/todo-schema';
import { Button } from './ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Marker, MarkerContent, MarkerIcon } from './ui/marker';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './ui/popover';

interface TodoCardProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export const TodoCard = ({ todo, onToggle, onDelete }: TodoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">{todo.title}</CardTitle>
        <CardAction className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggle}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? 'undo complete' : 'complete task'}`}
          >
            {todo.completed ? <ArrowTurnDownLeftIcon className="size-4" /> : <CheckIcon />}
          </Button>
          {todo.completed ? (
            <Button
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
                  <Button variant="outline" size="icon" aria-label={`Delete "${todo.title}"`}>
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
        {todo.description && <CardDescription>{todo.description}</CardDescription>}
      </CardHeader>
      <CardFooter className="flex flex-col gap-2">
        <Marker variant={todo.deadline ? 'border' : 'default'}>
          <MarkerIcon>
            {todo.completed ? <CircleCheck className="size-4 text-green-600" /> : <CalendarIcon />}
          </MarkerIcon>
          <MarkerContent>
            <span className="flex items-center gap-4">
              {lightFormat(todo.timestamp, 'MM/dd/yyyy, hh:mm aaaa')}
            </span>
          </MarkerContent>
        </Marker>
        {todo.deadline && (
          <Marker>
            <MarkerIcon>
              <InfoIcon />
            </MarkerIcon>
            <MarkerContent className={cn('text-right', todo.completed && 'line-through')}>
              Due {lightFormat(todo.deadline, todo.time ? 'MM/dd/yyyy, hh:mm aaaa' : 'MM/dd/yyyy')}
            </MarkerContent>
          </Marker>
        )}
      </CardFooter>
    </Card>
  );
};
