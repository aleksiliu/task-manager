'use client';

import { Check, Edit, Play, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Task, TaskStatus } from '@/types';
import styles from './task-item.module.css';

interface TaskItemProps {
  task: Task;
  onEdit: (id: number, description: string) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

export function TaskItem({ task, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleSubmit = () => {
    if (editedDescription.trim()) {
      onEdit(task.id, editedDescription);
      setIsEditing(false);
    }
  };

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
          <Button
            variant='outline'
            size='default'
            onClick={() => onStatusChange(task.id, 'doing')}
            className={styles.button}>
            <Play className={styles.icon} />
            Start Task
          </Button>
        );
      case 'doing':
        return (
          <Button
            variant='outline'
            size='default'
            onClick={() => onStatusChange(task.id, 'done')}
            className={styles.button}>
            <Check className={styles.icon} />
            Complete Task
          </Button>
        );
      case 'done':
        return (
          <div className={styles.actions}>
            <Check className={styles.icon} />
            Completed
          </div>
        );
    }
  };

  return (
    <li className={styles.task}>
      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.edit}>
            <Input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              autoFocus
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={handleSubmit}
              className={styles.iconButton}
              aria-label='Save task'>
              <Check className={styles.icon} />
            </Button>
          </div>
        ) : (
          <div className={styles.edit}>
            <span className={`${styles.description} ${task.status === 'done' ? styles.descriptionCompleted : ''}`}>
              {task.description}
            </span>
            {task.status !== 'done' && (
              <Button
                variant='ghost'
                size='icon'
                onClick={handleEdit}
                className={styles.iconButton}
                aria-label='Edit task'>
                <Edit className={styles.icon} />
              </Button>
            )}
          </div>
        )}
      </div>
      {!isEditing && (
        <div className={styles.actions}>
          <div className={styles.button}>{getStatusButton()}</div>
          <Button variant='ghost' size='icon' onClick={() => onDelete(task.id)} className={styles.iconButton}>
            <Trash2 className={styles.icon} />
          </Button>
        </div>
      )}
    </li>
  );
}
