import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { TaskList } from '@/types';

export function useLocalStorage() {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsClient(true);
      const stored = storage.load();
      setTaskLists(stored);
      setError(null);
    } catch {
      setError('Failed to load your tasks. Please refresh the page.');
      setTaskLists([]);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        storage.save(taskLists);
        setError(null);
      } catch {
        setError('Failed to save your changes. Please check your browser settings.');
      }
    }
  }, [taskLists, isClient]);

  return [taskLists, setTaskLists, error] as const;
}
