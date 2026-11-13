import { ArrowTurnDownLeftIcon } from '../assets/icons/ArrowTurnDownLeftIcon';
import { CircleCheckIcon } from '../assets/icons/CircleCheckIcon';
import type { Todo } from '../lib/todo-schema';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface TodoCardProps {
  todo: Todo;
  onToggle: () => void;
}

export const TodoCard = ({ todo, onToggle }: TodoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          {todo.title} {todo.completed && <Badge variant="outline">Completed</Badge>}
        </CardTitle>
        <CardAction>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggle}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? 'undo complete' : 'complete task'}`}
            className="border-0"
          >
            {todo.completed ? <ArrowTurnDownLeftIcon className="size-4" /> : <CircleCheckIcon />}
          </Button>
        </CardAction>
        {todo.description && <CardDescription>{todo.description}</CardDescription>}
      </CardHeader>
      <CardFooter className="justify-between text-sm text-muted-foreground">
        <p>Created {todo.timestamp.toLocaleString()}</p>
        {todo.deadline && (
          <Badge variant="secondary">Due {todo.deadline.toLocaleDateString()}</Badge>
        )}
      </CardFooter>
    </Card>
  );
};
