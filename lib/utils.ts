export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const TASK_CONSTRAINTS = {
  LIST_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 60,
    PATTERN: /^[\p{L}\p{N}]+$/u
  },
  TASK: {
    MIN_LENGTH: 1
  }
} as const;

export const truncateText = (text: string, maxLength: number = 45) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const validateListName = (name: string, existingNames: string[] = []): string | null => {
  if (name.trim().length < TASK_CONSTRAINTS.LIST_NAME.MIN_LENGTH) {
    return `Task list name must be at least ${TASK_CONSTRAINTS.LIST_NAME.MIN_LENGTH} characters`;
  }

  if (!TASK_CONSTRAINTS.LIST_NAME.PATTERN.test(name)) {
    return 'Task list name can only contain letters and numbers (no spaces or special characters)';
  }

  const normalizedName = name.trim().toLowerCase();
  const normalizedExistingNames = existingNames.map((n) => n.toLowerCase());

  if (normalizedExistingNames.includes(normalizedName)) {
    return 'A task list with this name already exists';
  }

  return null;
};
