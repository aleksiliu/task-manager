'use client';

import { ArrowRight, Check, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TASK_CONSTRAINTS, cn } from '@/lib/utils';
import { useFormValidation } from '@/hooks/use-form-validation';
import type { TaskList } from '@/types';

interface TaskListPreviewProps {
  taskList: TaskList;
  onEditName: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  existingNames: string[];
}

export function TaskListPreview({ taskList, onEditName, onDelete, existingNames }: TaskListPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(taskList.name);
  const { error, validateTaskList, setError } = useFormValidation();

  const totalTasks = taskList.tasks.length;
  const completedTasks = taskList.tasks.filter((task) => task.status === 'done').length;
  const inProgressTasks = taskList.tasks.filter((task) => task.status === 'doing').length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleSubmit = () => {
    const otherNames = existingNames.filter((name) => name !== taskList.name);

    if (validateTaskList(editedName, otherNames)) {
      onEditName(taskList.id, editedName);
      setIsEditing(false);
    }
  };

  return (
    <Card className='mb-4 transition-all hover:shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        {isEditing ? (
          <div className='flex flex-grow flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <label className='sr-only' htmlFor={`edit-list-${taskList.id}`}>
                Edit list name
              </label>
              <Input
                id={`edit-list-${taskList.id}`}
                value={editedName}
                onChange={(e) => {
                  setEditedName(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                maxLength={TASK_CONSTRAINTS.LIST_NAME.MAX_LENGTH}
                className={cn('flex-grow', error && 'border-red-500')}
                aria-invalid={error ? 'true' : 'false'}
              />
              <Button variant='ghost' size='icon' onClick={handleSubmit} aria-label='Save list name'>
                <Check className='h-4 w-4' />
              </Button>
            </div>
            {error && (
              <p role='alert' className='text-sm text-red-500'>
                {error}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className='flex items-center gap-2'>
              <Link href={`/task/${taskList.id}`} className='hover:opacity-80'>
                <CardTitle className='sm:truncate-none max-w-[200px] truncate sm:max-w-none'>{taskList.name}</CardTitle>
              </Link>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsEditing(true)}
                className='h-6 w-6 shrink-0'
                aria-label={`Edit list name: ${taskList.name}`}>
                <Edit className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex space-x-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => onDelete(taskList.id)}
                aria-label={`Delete list: ${taskList.name}`}>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </>
        )}
      </CardHeader>

      <div className='px-6 pb-4'>
        <div className='space-y-1'>
          <Link href={`/task/${taskList.id}`} className='block'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground'>Progress</span>
                <span className='text-muted-foreground'>
                  ({completedTasks}/{totalTasks} done
                  {inProgressTasks > 0 && `, ${inProgressTasks} in doing`})
                </span>
              </div>
              <span className='font-medium'>{progress}%</span>
            </div>
            <div className='mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary'>
              <div
                className={cn('h-full transition-all duration-300', progress === 100 ? 'bg-green-500' : 'bg-primary')}
                style={{ width: `${progress}%` }}
              />
            </div>
          </Link>
        </div>

        <div className='mt-4 flex items-center justify-center'>
          <Link
            href={`/task/${taskList.id}`}
            className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'>
            {totalTasks === 0 ? (
              <>
                Add tasks
                <ArrowRight className='h-4 w-4' />
              </>
            ) : (
              <>
                View tasks
                <ArrowRight className='h-4 w-4' />
              </>
            )}
          </Link>
        </div>
      </div>
    </Card>
  );
}
