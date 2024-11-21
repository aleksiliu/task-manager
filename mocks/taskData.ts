import { TaskList, TaskStatus } from '@/types';

export const mockData: TaskList[] = [
  {
    id: 1,
    name: 'GroceryShopping',
    tasks: [
      { id: 1, description: 'Buy milk', status: 'todo' as TaskStatus },
      { id: 2, description: 'Pick up bread', status: 'doing' as TaskStatus },
      { id: 3, description: 'Get eggs', status: 'done' as TaskStatus }
    ]
  },
  {
    id: 2,
    name: 'Work',
    tasks: [
      {
        id: 4,
        description: 'Complete project report',
        status: 'todo' as TaskStatus
      },
      {
        id: 5,
        description: 'Email team update',
        status: 'doing' as TaskStatus
      },
      {
        id: 6,
        description: 'Submit budget proposal',
        status: 'done' as TaskStatus
      }
    ]
  },
  {
    id: 3,
    name: 'WeekendChores',
    tasks: [
      {
        id: 7,
        description: 'Clean the living room',
        status: 'todo' as TaskStatus
      },
      { id: 8, description: 'Mow the lawn', status: 'doing' as TaskStatus },
      { id: 9, description: 'Wash the car', status: 'todo' as TaskStatus },
      {
        id: 10,
        description: 'Take out the trash',
        status: 'done' as TaskStatus
      }
    ]
  }
] as const;
