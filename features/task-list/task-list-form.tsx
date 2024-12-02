'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TASK_CONSTRAINTS } from '@/lib/utils';
import { useFormValidation } from '@/hooks/use-form-validation';
import styles from './task-list-form.module.css';

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
    <Card role='region' aria-label='Create new task list'>
      <CardHeader>
        <CardTitle >Create New Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={styles.form__container}>
          <div className={styles['form__input-group']}>
            <div className={styles['form__input-wrapper']}>
              <label className="sr-only" htmlFor='new-list-name'>
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
                maxLength={TASK_CONSTRAINTS.LIST_NAME.MAX_LENGTH}
                error={!!error}
              />
            </div>
            <Button type='submit' className={styles.form__button} aria-label='Create new list'>
              <Plus className={styles.form__icon} />
              Add List
            </Button>
          </div>
          {error && (
            <p role='alert' className={styles.form__error}>
              {error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
