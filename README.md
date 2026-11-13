# sofia-todo

A simple to-do app. Add tasks with a title, an optional description and an optional deadline, then tick them off when they are done.

Tasks are saved in your browser's localStorage, so there is no backend.

Built with Next.js, React, Tailwind, shadcn/ui and zod.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run format`.

## Notes

- The task schema is in `src/lib/todo-schema.ts`.
- Task state and localStorage logic are in `src/hooks/useTodos.ts`.
