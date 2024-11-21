'use client';

import { Check, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  return (
    <li className='flex items-center justify-between rounded-md bg-secondary p-3 transition-colors hover:bg-secondary/80'>
      {isEditing ? (
        <Input
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className='mr-2 flex-grow'
          autoFocus
        />
      ) : (
        <span className='mr-2 flex-grow truncate'>{task.description}</span>
      )}
      <div className='flex items-center space-x-2'>
        <Select value={task.status} onValueChange={(value: TaskStatus) => onStatusChange(task.id, value)}>
          <SelectTrigger className='w-[100px] bg-background'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='todo'>Todo</SelectItem>
            <SelectItem value='doing'>Doing</SelectItem>
            <SelectItem value='done'>Done</SelectItem>
          </SelectContent>
        </Select>
        <Button variant='ghost' size='icon' onClick={handleEdit}>
          {isEditing ? <Check className='h-4 w-4' /> : <Edit className='h-4 w-4' />}
        </Button>
        <Button variant='ghost' size='icon' onClick={() => onDelete(task.id)}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    </li>
  );
}
