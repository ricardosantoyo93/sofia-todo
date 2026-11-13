import { z } from 'zod';

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export const todoSchema = z.object({
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
