import { ChevronDownIcon } from './assets/icons';
import { Form } from './components/Form';
import { TodoCard } from './components/TodoCard';
import { Button } from './components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible';

function App() {
  return (
    <div className="relative isolate bg-white dark:bg-gray-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48 flex flex-col gap-4">
          <Collapsible>
            <CollapsibleTrigger
              render={
                <Button variant="ghost" className="w-full">
                  Completed
                  <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
                </Button>
              }
            />
            <CollapsibleContent>
              <div className="flex flex-col gap-4 mt-2">
                <TodoCard />
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible defaultOpen>
            <CollapsibleTrigger
              render={
                <Button variant="ghost" className="w-full">
                  To-do
                  <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
                </Button>
              }
            />
            <CollapsibleContent>
              <div className="flex flex-col gap-4 mt-2">
                <TodoCard />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48">
          <Form />
        </div>
      </div>
    </div>
  );
}

export default App;
