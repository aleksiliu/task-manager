import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const validateListName = (name: string, existingNames: string[] = []): string | null => {
  if (!name.trim()) {
    return 'List name cannot be empty';
  }

  if (name.length < TASK_CONSTRAINTS.LIST_NAME.MIN_LENGTH) {
    return `List name must be at least ${TASK_CONSTRAINTS.LIST_NAME.MIN_LENGTH} characters`;
  }

  if (name.length > TASK_CONSTRAINTS.LIST_NAME.MAX_LENGTH) {
    return `List name must be less than ${TASK_CONSTRAINTS.LIST_NAME.MAX_LENGTH} characters`;
  }

  if (!TASK_CONSTRAINTS.LIST_NAME.PATTERN.test(name)) {
    return 'List name can only contain letters and numbers (no spaces or special characters)';
  }

  if (existingNames.includes(name.trim())) {
    return 'A task list with this name already exists';
  }

  return null;
};
