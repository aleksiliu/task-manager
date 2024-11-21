'use client';

import { Check, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFormValidation } from '@/hooks/use-form-validation';
import type { TaskList } from '@/types';

interface TaskListPreviewProps {
  taskList: TaskList;
  onEditName: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export function TaskListPreview({ taskList, onEditName, onDelete }: TaskListPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(taskList.name);
  const { error, validateTaskList, setError } = useFormValidation();

  const totalTasks = taskList.tasks.length;
  const completedTasks = taskList.tasks.filter((task) => task.status === 'done').length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleSubmit = () => {
    if (validateTaskList(editedName, [])) {
      onEditName(taskList.id, editedName);
      setIsEditing(false);
    }
  };

  return (
    <Link href={`/task/${taskList.id}`} className='block'>
      <Card className='mb-4 cursor-pointer transition-all hover:shadow-md'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          {isEditing ? (
            <div className='flex flex-grow flex-col gap-2' onClick={(e) => e.preventDefault()}>
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
                  maxLength={60}
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
                <CardTitle className='sm:truncate-none max-w-[200px] truncate sm:max-w-none'>{taskList.name}</CardTitle>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                  className='h-6 w-6 shrink-0'>
                  <Edit className='h-4 w-4' />
                </Button>
              </div>
              <div className='flex space-x-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(taskList.id);
                  }}>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </>
          )}
        </CardHeader>

        <div className='px-6 pb-4'>
          <div className='space-y-1'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground'>Progress</span>
                <span className='text-muted-foreground'>
                  ({completedTasks}/{totalTasks} tasks)
                </span>
              </div>
              <span className='font-medium'>{progress}%</span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-secondary'>
              <div
                className={cn('h-full transition-all duration-300', progress === 100 ? 'bg-green-500' : 'bg-primary')}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
