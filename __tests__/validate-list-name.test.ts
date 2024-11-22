import { TASK_CONSTRAINTS, validateListName } from '@/lib/utils';

describe('Task List Name Validation', () => {
  test('should accept valid task list names', () => {
    const validNames = ['TaskList1', 'MyList2024', 'абвгд12345', '任务列表123', 'Liste123'];

    validNames.forEach((name) => {
      expect(validateListName(name)).toBeNull();
    });
  });

  test('should reject names with invalid characters', () => {
    const invalidNames = [
      { name: 'Task List 1', reason: 'contains spaces' },
      { name: 'List-123', reason: 'contains hyphen' },
      { name: 'List@123', reason: 'contains special character' },
      { name: 'List_123', reason: 'contains underscore' },
      { name: '!@#$%^', reason: 'only special characters' }
    ];

    invalidNames.forEach(({ name }) => {
      expect(validateListName(name)).toBe(
        'Task list name can only contain letters and numbers (no spaces or special characters)'
      );
    });
  });

  test('should handle duplicate names with different casing', () => {
    const existingNames = ['TaskList1'];
    expect(validateListName('tasklist1', existingNames)).toBe('A task list with this name already exists');
  });

  test('should reject empty or whitespace-only names', () => {
    const emptyNames = ['', '     '];

    emptyNames.forEach((name) => {
      expect(validateListName(name)).toBe(
        `Task list name must be at least ${TASK_CONSTRAINTS.LIST_NAME.MIN_LENGTH} characters`
      );
    });
  });
});
