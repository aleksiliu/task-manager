'use client';

import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { TaskContainer } from '@/features/task-list/task-container';
import { NewTaskListForm } from '@/features/task-list/task-list-form';
import type { TaskStatus } from '@/types';

export default function TaskManager() {
  const [taskLists, setTaskLists, error] = useLocalStorage();

  const addTaskList = (name: string) => {
    if (name.trim() && name.length <= 60 && !taskLists.some((list) => list.name === name.trim())) {
      setTaskLists([{ id: Date.now(), name: name.trim(), tasks: [] }, ...taskLists]);
    }
  };

  const editTaskListName = (id: number, name: string) => {
    if (name.trim() && name.length <= 60 && !taskLists.some((list) => list.name === name.trim())) {
      setTaskLists(taskLists.map((list) => (list.id === id ? { ...list, name: name.trim() } : list)));
    }
  };

  const deleteTaskList = (id: number) => {
    setTaskLists(taskLists.filter((list) => list.id !== id));
  };

  const addTask = (listId: number, description: string) => {
    setTaskLists(
      taskLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: [{ id: Date.now(), description, status: 'todo' }, ...list.tasks]
            }
          : list
      )
    );
  };

  const editTask = (listId: number, taskId: number, description: string) => {
    setTaskLists(
      taskLists.map((list) =>
        list.id === listId
          ? { ...list, tasks: list.tasks.map((task) => (task.id === taskId ? { ...task, description } : task)) }
          : list
      )
    );
  };

  const deleteTask = (listId: number, taskId: number) => {
    setTaskLists(
      taskLists.map((list) =>
        list.id === listId ? { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) } : list
      )
    );
  };

  const changeTaskStatus = (listId: number, taskId: number, status: TaskStatus) => {
    setTaskLists(
      taskLists.map((list) =>
        list.id === listId
          ? { ...list, tasks: list.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)) }
          : list
      )
    );
  };

  return (
    <div className='container mx-auto max-w-3xl p-4'>
      <h1 className='mb-6 text-3xl font-bold'>Advanced Task Manager</h1>

      {error && (
        <div className='mb-4 rounded-md bg-destructive/15 p-4 text-destructive' role='alert'>
          <p>{error}</p>
        </div>
      )}

      <NewTaskListForm onSubmit={addTaskList} existingNames={taskLists.map((list) => list.name)} />
      {taskLists.map((taskList) => (
        <TaskContainer
          key={taskList.id}
          taskList={taskList}
          onEditName={editTaskListName}
          onDelete={deleteTaskList}
          onAddTask={addTask}
          onEditTask={editTask}
          onDeleteTask={deleteTask}
          onChangeTaskStatus={changeTaskStatus}
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
