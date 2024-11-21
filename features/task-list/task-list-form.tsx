import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TASK_CONSTRAINTS, cn } from '@/lib/utils';
import { useFormValidation } from '@/hooks/use-form-validation';

interface NewTaskListFormProps {
  onSubmit: (name: string) => void;
  existingNames: string[];
}

export function NewTaskListForm({ onSubmit, existingNames }: NewTaskListFormProps) {
  const [newListName, setNewListName] = useState('');
  const { error, validateTaskList, setError } = useFormValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTaskList(newListName, existingNames)) {
      onSubmit(newListName.trim());
      setNewListName('');
    }
  };

  return (
    <Card className='mb-6' role='region' aria-label='Create new task list'>
      <CardHeader>
        <CardTitle>Create New Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-2'>
          <div className='flex space-x-2'>
            <div className='flex-grow'>
              <label className='sr-only' htmlFor='new-list-name'>
                New task list name
              </label>
              <Input
                id='new-list-name'
                type='text'
                value={newListName}
                onChange={(e) => {
                  setNewListName(e.target.value);
                  setError(null);
                }}
                placeholder='New task list name'
                className={cn('w-full', error && 'border-red-500')}
                maxLength={TASK_CONSTRAINTS.LIST_NAME.MAX_LENGTH}
                aria-invalid={error ? 'true' : 'false'}
              />
            </div>
            <Button type='submit' aria-label='Create new list'>
              <Plus className='h-4 w-4' />
              Add List
            </Button>
          </div>
          {error && (
            <p role='alert' className='text-sm text-red-500'>
              {error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
