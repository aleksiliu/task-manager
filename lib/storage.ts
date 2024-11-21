import { TaskList } from '@/types';

const STORAGE_KEY = 'taskManager';

export const storage = {
  save: (taskLists: TaskList[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(taskLists));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  load: (): TaskList[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
