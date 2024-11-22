import { act, renderHook } from '@testing-library/react';
import { storage } from '@/lib/storage';
import { useTaskOperations } from '@/hooks/use-task-operations';

jest.mock('@/lib/storage', () => ({
  storage: {
    save: jest.fn(),
    load: jest.fn(),
    clear: jest.fn()
  }
}));

describe('useTaskOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storage.load as jest.Mock).mockReturnValue([]);
  });

  describe('addTaskList', () => {
    it('should add a new task list', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('NewList');
      });

      expect(result.current.taskLists).toHaveLength(1);
      expect(result.current.taskLists[0]).toEqual({
        id: expect.any(Number),
        name: 'NewList',
        tasks: []
      });
    });

    it('should not add task list with duplicate name', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('NewList');
        result.current.addTaskList('NewList');
      });

      expect(result.current.taskLists).toHaveLength(1);
    });
  });

  describe('editTaskListName', () => {
    it('should edit task list name', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('OldName');
      });

      const listId = result.current.taskLists[0].id;

      act(() => {
        result.current.editTaskListName(listId, 'NewName');
      });

      expect(result.current.taskLists[0].name).toBe('NewName');
    });
  });

  describe('task operations', () => {
    it('should add task to list', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('MyList');
      });

      const listId = result.current.taskLists[0].id;

      act(() => {
        result.current.addTask(listId, 'New Task');
      });

      expect(result.current.taskLists[0].tasks).toHaveLength(1);
      expect(result.current.taskLists[0].tasks[0]).toEqual({
        id: expect.any(Number),
        description: 'New Task',
        status: 'todo'
      });
    });

    it('should edit task', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('MyList');
      });

      const listId = result.current.taskLists[0].id;

      act(() => {
        result.current.addTask(listId, 'Original Task');
      });

      const taskId = result.current.taskLists[0].tasks[0].id;

      act(() => {
        result.current.editTask(listId, taskId, 'Updated Task');
      });

      expect(result.current.taskLists[0].tasks[0].description).toBe('Updated Task');
    });

    it('should change task status', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('MyList');
      });

      const listId = result.current.taskLists[0].id;

      act(() => {
        result.current.addTask(listId, 'Task');
      });

      const taskId = result.current.taskLists[0].tasks[0].id;

      act(() => {
        result.current.changeTaskStatus(listId, taskId, 'doing');
      });

      expect(result.current.taskLists[0].tasks[0].status).toBe('doing');
    });

    it('should delete task', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('MyList');
      });

      const listId = result.current.taskLists[0].id;

      act(() => {
        result.current.addTask(listId, 'Task to delete');
      });

      const taskId = result.current.taskLists[0].tasks[0].id;

      act(() => {
        result.current.deleteTask(listId, taskId);
      });

      expect(result.current.taskLists[0].tasks).toHaveLength(0);
    });
  });

  describe('deleteTaskList', () => {
    it('should delete task list', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('ListToDelete');
      });

      const listId = result.current.taskLists[0].id;

      act(() => {
        result.current.deleteTaskList(listId);
      });

      expect(result.current.taskLists).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty task list name', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('');
      });

      expect(result.current.taskLists).toHaveLength(0);
    });

    it('should verify storage interactions', () => {
      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.addTaskList('MyList');
      });

      expect(storage.save).toHaveBeenCalled();
      expect(storage.load).toHaveBeenCalled();
    });
  });
});
