import { z } from 'zod';

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export const todoSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  deadline: z
    .date()
    .refine((date) => date >= startOfToday(), 'Deadline cannot be in the past')
    .optional(),
  time: z.string().optional(),
  timestamp: z.date(),
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof todoSchema>;

export function createEditTodoSchema(todo: Todo) {
  return todoSchema.extend({
    deadline: z
      .date()
      .optional()
      .refine(
        (date) =>
          date?.getTime() === todo.deadline?.getTime() ||
          todoSchema.shape.deadline.safeParse(date).success,
        'Deadline cannot be in the past',
      ),
  });
}

export function parseTodoForm(data: FormData, initialTodo?: Todo) {
  const deadline = String(data.get('deadline') ?? '');
  const time = String(data.get('time') ?? '') || undefined;
  const schema = initialTodo ? createEditTodoSchema(initialTodo) : todoSchema;
  return schema.safeParse({
    ...(initialTodo ?? { id: crypto.randomUUID(), timestamp: new Date() }),
    title: String(data.get('title') ?? ''),
    description: String(data.get('description') ?? '') || undefined,
    deadline: deadline ? new Date(`${deadline}T${time ?? '00:00'}`) : undefined,
    time,
  });
}

export function validateTodoDeadline(date: Date | undefined, initialTodo?: Todo) {
  const unchangedDay =
    date && initialTodo?.deadline && date.toDateString() === initialTodo.deadline.toDateString();
  const schema = initialTodo ? createEditTodoSchema(initialTodo) : todoSchema;
  return schema.shape.deadline.safeParse(unchangedDay ? initialTodo.deadline : date);
}
