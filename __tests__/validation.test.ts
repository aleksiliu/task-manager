import { validateListName } from '@/lib/utils';

describe('Task List Name Validation', () => {
  test('should accept valid task list names', () => {
    const validNames = ['TaskList1', 'MyList2024', 'абвгд12345', '任务列表123', 'Liste123'];

    validNames.forEach((name) => {
      expect(validateListName(name)).toBeNull();
    });
  });

  test('should reject invalid task list names', () => {
    const invalidNames = [
      { name: 'Task List 1', reason: 'contains spaces' },
      { name: 'List-123', reason: 'contains hyphen' },
      { name: 'List@123', reason: 'contains special character' },
      { name: 'List_123', reason: 'contains underscore' },
      { name: '!@#$%^', reason: 'only special characters' },
      { name: '     ', reason: 'only spaces' },
      { name: '', reason: 'empty string' },
      { name: 'A'.repeat(61), reason: 'too long (61 characters)' }
    ];

    invalidNames.forEach(({ name }) => {
      expect(validateListName(name)).not.toBeNull();
    });
  });

  test('should reject names longer than 60 characters', () => {
    const longName = 'A'.repeat(61);
    expect(validateListName(longName)).toBe('List name must be less than 60 characters');
  });
});
