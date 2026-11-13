import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  deadline: z.date().optional(),
  timestamp: z.date(),
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof todoSchema>;
