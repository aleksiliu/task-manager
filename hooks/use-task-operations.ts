import type { TaskStatus } from '@/types';
import { useLocalStorage } from './use-local-storage';

export function useTaskOperations(onTaskListDeleted?: () => void) {
  const [taskLists, setTaskLists, error] = useLocalStorage();

  const addTaskList = (name: string) => {
    const normalizedName = name.trim();
    const exists = taskLists.some((list) => list.name.toLowerCase() === normalizedName.toLowerCase());

    if (normalizedName && normalizedName.length <= 60 && !exists) {
      setTaskLists([{ id: Date.now(), name: normalizedName, tasks: [] }, ...taskLists]);
    }
  };

  const editTaskListName = (id: number, name: string) => {
    const normalizedName = name.trim();
    const exists = taskLists.some((list) => list.id !== id && list.name.toLowerCase() === normalizedName.toLowerCase());

    if (normalizedName && normalizedName.length <= 60 && !exists) {
      setTaskLists(taskLists.map((list) => (list.id === id ? { ...list, name: normalizedName } : list)));
    }
  };

  const deleteTaskList = async (id: number) => {
    setTaskLists(taskLists.filter((list) => list.id !== id));
    await Promise.resolve();
    if (onTaskListDeleted) {
      onTaskListDeleted();
    }
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

  return {
    taskLists,
    error,
    addTaskList,
    editTaskListName,
    deleteTaskList,
    addTask,
    editTask,
    deleteTask,
    changeTaskStatus
  };
}
