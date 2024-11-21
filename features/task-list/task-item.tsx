'use client';

import { Check, Edit, Play, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Task, TaskStatus } from '@/types';

interface TaskItemProps {
  task: Task;
  onEdit: (id: number, description: string) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

export function TaskItem({ task, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(task.id, editedDescription);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const getStatusButton = () => {
    switch (task.status) {
      case 'todo':
        return (
          <Button variant='outline' size='sm' onClick={() => onStatusChange(task.id, 'doing')}>
            <Play className='mr-1 h-4 w-4' />
            Start Task
          </Button>
        );
      case 'doing':
        return (
          <Button variant='outline' size='sm' onClick={() => onStatusChange(task.id, 'done')}>
            <Check className='mr-1 h-4 w-4' />
            Complete Task
          </Button>
        );
      case 'done':
        return (
          <div className='flex items-center'>
            <Check className='mr-1 h-4 w-4' />
            Completed
          </div>
        );
    }
  };

  return (
    <li className='flex items-center justify-between rounded-md bg-secondary p-3 transition-colors hover:bg-secondary/80'>
      <div className='mr-2 flex flex-grow items-center'>
        {isEditing ? (
          <div className='flex flex-grow items-center gap-2'>
            <Input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className='flex-grow'
              autoFocus
            />
            <Button variant='ghost' size='icon' onClick={handleEdit} className='h-6 w-6'>
              <Check className='h-4 w-4' />
            </Button>
          </div>
        ) : (
          <div className='flex flex-grow items-center gap-2'>
            <span className={`truncate ${task.status === 'done' ? 'line-through' : ''}`}>{task.description}</span>
            {task.status !== 'done' && (
              <Button variant='ghost' size='icon' onClick={handleEdit} className='h-6 w-6'>
                <Edit className='h-4 w-4' />
              </Button>
            )}
          </div>
        )}
      </div>
      {!isEditing && (
        <div className='flex items-center space-x-2'>
          {getStatusButton()}
          {task.status !== 'done' && (
            <Button variant='ghost' size='icon' onClick={() => onDelete(task.id)}>
              <Trash2 className='h-4 w-4' />
            </Button>
          )}
        </div>
      )}
    </li>
  );
}
