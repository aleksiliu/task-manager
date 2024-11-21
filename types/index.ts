export type TaskStatus = 'todo' | 'doing' | 'done';

export type Task = {
  id: number;
  description: string;
  status: TaskStatus;
};

export type TaskList = {
  id: number;
  name: string;
  tasks: Task[];
};
