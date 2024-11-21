import { useState } from 'react';
import { TASK_CONSTRAINTS, validateListName } from '@/lib/utils';

export function useFormValidation() {
  const [error, setError] = useState<string | null>(null);

  const validateTaskList = (name: string, existingNames: string[]) => {
    const error = validateListName(name, existingNames);
    setError(error);
    return !error;
  };

  const validateTask = (description: string) => {
    if (description.length < TASK_CONSTRAINTS.TASK.MIN_LENGTH) {
      setError('Task description cannot be empty');
      return false;
    }
    if (description.length > TASK_CONSTRAINTS.TASK.MAX_LENGTH) {
      setError(`Task description must be less than ${TASK_CONSTRAINTS.TASK.MAX_LENGTH} characters`);
      return false;
    }
    setError(null);
    return true;
  };

  return {
    error,
    setError,
    validateTaskList,
    validateTask
  };
}
