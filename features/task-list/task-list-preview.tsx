'use client';

import { ArrowRight, Check, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TASK_CONSTRAINTS } from '@/lib/utils';
import { useFormValidation } from '@/hooks/use-form-validation';
import type { TaskList } from '@/types';
import styles from './task-list-preview.module.css';

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
    if (editedName === taskList.name) {
      setIsEditing(false);
      return;
    }

    const otherNames = existingNames.filter((name) => name !== taskList.name);
    if (validateTaskList(editedName, otherNames)) {
      onEditName(taskList.id, editedName);
      setIsEditing(false);
    }
  };

  return (
    <Card className={styles.preview}>
      <CardHeader className={styles.preview__header}>
        {isEditing ? (
          <div className={styles.preview__edit}>
            <div className={styles['preview__edit-group']}>
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
                className={error ? styles['preview__input--error'] : ''}
                aria-invalid={error ? 'true' : 'false'}
              />
              <Button variant='ghost' size='icon' onClick={handleSubmit} aria-label='Save list name'>
                <Check className={styles.button__icon} />
              </Button>
            </div>
            {error && (
              <p role='alert' className={styles.preview__error}>
                {error}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className={styles['preview__edit-group']}>
              <Link href={`/task/${taskList.id}`} className={styles['preview__title-link']}>
                <CardTitle className={styles.preview__title} title={taskList.name}>
                  {taskList.name}
                </CardTitle>
              </Link>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsEditing(true)}
                aria-label={`Edit list name: ${taskList.name}`}>
                <Edit className={styles.button__icon} />
              </Button>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(taskList.id)}
              aria-label={`Delete list: ${taskList.name}`}>
              <Trash2 className={styles.button__icon} />
            </Button>
          </>
        )}
      </CardHeader>

      <div className={styles.preview__content}>
        <Link href={`/task/${taskList.id}`}>
          <div className={styles.preview__progress}>
            <div className={styles['preview__progress-text']}>
              <div className={styles['preview__edit-group']}>
                <span>Progress</span>
                <span>
                  ({completedTasks}/{totalTasks} done
                  {inProgressTasks > 0 && `, ${inProgressTasks} in doing`})
                </span>
              </div>
              <span>{progress}%</span>
            </div>
            <div className={styles['preview__progress-bar']}>
              <div 
                className={styles['preview__progress-fill']} 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </Link>

        <div className={styles.preview__footer}>
          <Link href={`/task/${taskList.id}`} className={styles.preview__link}>
            {totalTasks === 0 ? (
              <>
                Add tasks
                <ArrowRight className={styles.button__icon} />
              </>
            ) : (
              <>
                View tasks
                <ArrowRight className={styles.button__icon} />
              </>
            )}
          </Link>
        </div>
      </div>
    </Card>
  );
}