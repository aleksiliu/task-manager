import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { TaskList } from '@/types';

export function useLocalStorage(initialValue: TaskList[] = []) {
  const [taskLists, setTaskLists] = useState<TaskList[]>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = storage.load();
    if (stored.length > 0) {
      setTaskLists(stored);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      storage.save(taskLists);
    }
  }, [taskLists, isClient]);

  return [taskLists, setTaskLists] as const;
}
