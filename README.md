# Task Manager

A Next.js application for managing tasks and task lists.

## Live Demo

Visit the live application: [Task Manager](https://task-manager-one-tawny.vercel.app/)

## Features

- Create and manage multiple task lists
- Add, edit, and delete tasks
- Change task status (todo, doing, done)
- Form validation for task lists and tasks
- Real-time persistence with localStorage

## Prerequisites

- Node.js 20 or higher
- npm 9 or higher

## Installation

1. Clone the repository:

```bash
git clone https://github.com/aleksiliu/task-manager.git
cd task-manager
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

> **Note:** The `--legacy-peer-deps` flag is required due to:
>
> - Peer dependency conflicts between shadcn/ui components and React 18/19
> - Testing library dependencies (@testing-library/react and Jest) compatibility with newer React versions
>
> This is a temporary solution until these dependencies are fully compatible with the latest React versions.

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Testing

Run the tests

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
```

## Folder Structure

### `/app` - Next.js App Router

- `page.tsx` - Main task list page
- `task/[id]/page.tsx` - Individual task list view
- `not-found.tsx` - 404 error page

### `/features` - Feature-based components

- `task-list/`
  - `task-container.tsx` - Main task list container
  - `task-item.tsx` - Individual task component
  - `task-list-form.tsx` - New task list creation form
  - `task-list-preview.tsx` - Task list preview card

### `/hooks` - Custom React hooks

- `use-form-validation.ts` - Form validation logic
- `use-local-storage.ts` - localStorage management
- `use-task-operations.ts` - Task CRUD operations

### `/lib` - Utility functions

- `storage.ts` - localStorage interface
- `utils.ts` - Common utilities and constants

### `/mocks` - Mock data

- `taskData.ts` - Sample task data for testing

### `/types` - TypeScript definitions

- `index.ts` - Core type definitions (TaskList, Task, TaskStatus)

### `/__tests__` - Test files

- `hooks/` - Tests for custom hooks
- `validate-list-name.test.ts` - Validation utility tests
