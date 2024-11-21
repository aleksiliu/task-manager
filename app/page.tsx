'use client';

import { useState } from 'react';
import { NewTaskListForm } from '@/features/task-list/task-list-form';
import { TaskList } from '@/types';

export default function TaskManager() {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);

  const addTaskList = (name: string) => {
    if (!taskLists.some((list) => list.name === name)) {
      setTaskLists([...taskLists, { id: Date.now(), name, tasks: [] }]);
    }
  };
  return (
    <div className='container p-4'>
      <h1 className='mb-6 text-3xl font-bold'>Task Manager</h1>
      <NewTaskListForm onSubmit={addTaskList} />
    </div>
  );
}
