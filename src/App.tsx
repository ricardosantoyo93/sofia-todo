'use client';

import { ChevronDownIcon } from './assets/icons';
import { Form } from './components/Form';
import { TodoCard } from './components/TodoCard';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible';
import { Empty, EmptyDescription, EmptyHeader } from './components/ui/empty';
import { Separator } from './components/ui/separator';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  const renderTodos = (list: typeof todos) => {
    if (list.length === 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyDescription>
              {list === completedTodos ? 'No completed tasks' : 'No pending tasks'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return list.map((todo) => (
      <TodoCard
        key={todo.timestamp.getTime()}
        todo={todo}
        onToggle={() => toggleTodo(todo.timestamp)}
        onDelete={() => deleteTodo(todo.timestamp)}
      />
    ));
  };

  return (
    <div className="relative isolate bg-white dark:bg-gray-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48 flex flex-col gap-4">
          <Collapsible>
            <CollapsibleTrigger
              render={
                <Button variant="ghost" className="w-full">
                  <span className="flex items-center gap-2">
                    Completed <Badge variant="outline">{completedTodos.length}</Badge>
                  </span>
                  <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
                </Button>
              }
            />
            <CollapsibleContent>
              <div className="flex flex-col gap-4 mt-2">{renderTodos(completedTodos)}</div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible defaultOpen>
            <CollapsibleTrigger
              render={
                <Button variant="ghost" className="w-full">
                  <span className="flex items-center gap-2">
                    Pending <Badge variant="outline">{pendingTodos.length}</Badge>
                  </span>
                  <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
                </Button>
              }
            />
            <CollapsibleContent>
              <div className="flex flex-col gap-4 mt-2">{renderTodos(pendingTodos)}</div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48">
          <Form onSubmit={addTodo} />
        </div>
      </div>
    </div>
  );
}

export default App;
