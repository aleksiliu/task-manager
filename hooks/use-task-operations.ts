import type { TaskStatus } from '@/types';
import { useLocalStorage } from './use-local-storage';

export function useTaskOperations() {
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
