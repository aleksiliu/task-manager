'use client';

import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { NewTaskListForm } from '@/features/task-list/task-list-form';
import { TaskListPreview } from '@/features/task-list/task-list-preview';

export default function TaskManager() {
  const { taskLists, error, addTaskList, editTaskListName, deleteTaskList } = useTaskOperations();

  return (
    <div className='container mt-4 max-w-3xl p-4'>
      <h1 className='mb-6 text-2xl font-bold'>Advanced Task Manager</h1>

      {error && (
        <div className='mb-4 rounded-md bg-destructive/15 p-4 text-destructive' role='alert'>
          <p>{error}</p>
        </div>
      )}

      <NewTaskListForm onSubmit={addTaskList} existingNames={taskLists.map((list) => list.name)} />
      {taskLists.map((taskList) => (
        <TaskListPreview
          key={taskList.id}
          taskList={taskList}
          onEditName={editTaskListName}
          onDelete={deleteTaskList}
        />
      ))}
      {taskLists.length === 0 && (
        <div className='flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center'>
          <div className='rounded-full bg-neutral-100 p-3'>
            <ClipboardList className='h-6 w-6 text-neutral-500' />
          </div>
          <div className='space-y-1'>
            <h3 className='font-semibold text-neutral-900'>No tasks yet</h3>
            <p className='text-sm text-neutral-500'>Create your first task list to get started</p>
          </div>
          <Button onClick={() => document.querySelector('input')?.focus()} variant='outline' className='mt-2'>
            <Plus className='mr-2 h-4 w-4' />
            Create task list
          </Button>
        </div>
      )}
    </div>
  );
}
