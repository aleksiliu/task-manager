import { act, renderHook } from '@testing-library/react';
import { storage } from '@/lib/storage';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { TaskList } from '@/types';

jest.mock('@/lib/storage', () => ({
  storage: {
    save: jest.fn(),
    load: jest.fn(),
    clear: jest.fn()
  }
}));

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    (storage.load as jest.Mock).mockReturnValue([]);
  });

  test('should initialize with empty array', () => {
    const { result } = renderHook(() => useLocalStorage());
    const [taskLists] = result.current;

    expect(taskLists).toEqual([]);
  });

  test('should update localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage());
    const mockTaskList: TaskList = {
      id: 1,
      name: 'TestList',
      tasks: []
    };

    act(() => {
      const [, setTaskLists] = result.current;
      setTaskLists([mockTaskList]);
    });

    expect(storage.save).toHaveBeenCalledWith([mockTaskList]);
  });

  test('should load existing data from localStorage', () => {
    const existingData: TaskList[] = [
      {
        id: 1,
        name: 'ExistingList',
        tasks: [{ id: 1, description: 'Task 1', status: 'todo' }]
      }
    ];
    (storage.load as jest.Mock).mockReturnValue(existingData);

    const { result } = renderHook(() => useLocalStorage());
    const [taskLists] = result.current;

    expect(taskLists).toEqual(existingData);
  });

  test('should handle save errors', () => {
    const { result } = renderHook(() => useLocalStorage());

    (storage.save as jest.Mock).mockImplementation(() => {
      throw new Error('Save error');
    });

    act(() => {
      const [, setTaskLists] = result.current;
      setTaskLists([{ id: 1, name: 'Test', tasks: [] }]);
    });

    const [, , error] = result.current;
    expect(error).toBe('Failed to save your changes. Please check your browser settings.');
  });
});
