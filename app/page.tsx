'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { TaskListComponent } from '@/features/task-list/task-list';
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
        <TaskListComponent
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
        <p className='text-center text-muted-foreground'>No task lists yet. Create your first list above!</p>
      )}
    </div>
  );
}
