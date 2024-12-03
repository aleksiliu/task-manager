'use client';

import { Check, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TASK_CONSTRAINTS, truncateText } from '@/lib/utils';
import { useFormValidation } from '@/hooks/use-form-validation';
import type { TaskList, TaskStatus } from '@/types';
import styles from './task-container.module.css';
import { TaskItem } from './task-item';

interface TaskContainerProps {
  taskList: TaskList;
  onEditName: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  onAddTask: (listId: number, description: string) => void;
  onEditTask: (listId: number, taskId: number, description: string) => void;
  onDeleteTask: (listId: number, taskId: number) => void;
  onChangeTaskStatus: (listId: number, taskId: number, status: TaskStatus) => void;
  existingNames: string[];
}

export function TaskContainer({
  taskList,
  onEditName,
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onChangeTaskStatus,
  existingNames
}: TaskContainerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(taskList.name);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [filter, setFilter] = useState<TaskStatus>('todo');

  const { error: nameError, validateTaskList, setError: setNameError } = useFormValidation();
  const { error: taskError, validateTask, setError: setTaskError } = useFormValidation();

  const handleSubmit = () => {
    if (editedName === taskList.name) {
      setIsEditing(false);
      return;
    }

    const otherNames = existingNames.filter((name) => name !== taskList.name!);
    if (validateTaskList(editedName, otherNames)) {
      onEditName(taskList.id, editedName);
      setIsEditing(false);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTask(newTaskDescription)) {
      onAddTask(taskList.id, newTaskDescription.trim());
      setNewTaskDescription('');
      setFilter('todo');
    }
  };

  const filteredTasks = taskList.tasks.filter((task) => task.status === filter);

  return (
    <Card role='region' aria-label={`Task list: ${taskList.name}`}>
      <CardHeader>
        {isEditing ? (
          <div className={styles.edit}>
            <div className={styles.editGroup}>
              <label className='sr-only' htmlFor={`edit-list-${taskList.id}`}>
                Edit list name
              </label>
              <Input
                id={`edit-list-${taskList.id}`}
                value={editedName}
                onChange={(e) => {
                  setEditedName(e.target.value);
                  setNameError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                maxLength={TASK_CONSTRAINTS.LIST_NAME.MAX_LENGTH}
                error={!!nameError}
              />
              <Button
                variant='ghost'
                size='icon'
                onClick={handleSubmit}
                className={styles.editButton}
                aria-label='Save list name'>
                <Check className={styles.editIcon} />
              </Button>
            </div>
            {nameError && (
              <p role='alert' className={styles.error}>
                {nameError}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className={styles.editGroup}>
              <CardTitle title={taskList.name}>{truncateText(taskList.name)}</CardTitle>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
                aria-label={`Edit list name: ${taskList.name}`}>
                <Edit className={styles.editIcon} />
              </Button>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(taskList.id)}
              className={styles.editButton}
              aria-label={`Delete list: ${taskList.name}`}>
              <Trash2 className={styles.editIcon} />
            </Button>
          </>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className={styles.form}>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <label className='sr-only' htmlFor={`new-task-${taskList.id}`}>
                Add new task
              </label>
              <Input
                id={`new-task-${taskList.id}`}
                type='text'
                value={newTaskDescription}
                onChange={(e) => {
                  setNewTaskDescription(e.target.value);
                  setTaskError(null);
                }}
                placeholder='Add a new task'
                error={!!taskError}
              />
            </div>
            <Button type='submit' className={styles.formButton} aria-label='Add new task'>
              <Plus className={styles.editIcon} />
              Add Task
            </Button>
          </div>
          {taskError && (
            <p role='alert' className={styles.error}>
              {taskError}
            </p>
          )}
        </form>

        {taskList.tasks.length === 0 ? (
          <p className={styles.noTasks} role='status'>
            No tasks yet. Add your first task above!
          </p>
        ) : (
          <>
            <div className={styles.filter}>
              <label htmlFor='task-filter' className='sr-only'>
                Filter tasks
              </label>
              <select
                id='task-filter'
                value={filter}
                onChange={(e) => setFilter(e.target.value as TaskStatus)}
                className='w-full p-2 border rounded'>
                <option value='todo'>Todo ({taskList.tasks.filter((t) => t.status === 'todo').length})</option>
                <option value='doing'>Doing ({taskList.tasks.filter((t) => t.status === 'doing').length})</option>
                <option value='done'>Done ({taskList.tasks.filter((t) => t.status === 'done').length})</option>
              </select>
            </div>

            {filteredTasks.length > 0 ? (
              <ul className={styles.tasks} role='list' aria-label='Task list'>
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={(taskId, description) => onEditTask(taskList.id, taskId, description)}
                    onDelete={(taskId) => onDeleteTask(taskList.id, taskId)}
                    onStatusChange={(taskId, status) => onChangeTaskStatus(taskList.id, taskId, status)}
                  />
                ))}
              </ul>
            ) : (
              <p className={styles.noTasks} role='status'>
                No tasks found for the selected filter
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
