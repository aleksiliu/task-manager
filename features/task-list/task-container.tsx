'use client';

import { Check, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <Card className={styles['task-container']} role='region' aria-label={`Task list: ${taskList.name}`}>
      <CardHeader className={styles['task-container__header']}>
        {isEditing ? (
          <div className={styles['task-container__edit']}>
            <div className={styles['task-container__edit-group']}>
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
                className={styles['task-container__edit-button']}
                aria-label='Save list name'>
                <Check className={styles['task-container__edit-icon']} />
              </Button>
            </div>
            {nameError && (
              <p role='alert' className={styles['task-container__error']}>
                {nameError}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className={styles['task-container__edit-group']}>
              <Popover>
                <PopoverTrigger asChild>
                  <CardTitle className={styles['task-container__title']} title={taskList.name}>
                    {truncateText(taskList.name)}
                  </CardTitle>
                </PopoverTrigger>
                <PopoverContent className={styles['task-container__popover-content']}>
                  <div className={styles['task-container__popover-text']}>{taskList.name}</div>
                </PopoverContent>
              </Popover>

              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsEditing(true)}
                className={styles['task-container__edit-button']}
                aria-label={`Edit list name: ${taskList.name}`}>
                <Edit className={styles['task-container__edit-icon']} />
              </Button>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(taskList.id)}
              className={styles['task-container__edit-button']}
              aria-label={`Delete list: ${taskList.name}`}>
              <Trash2 className={styles['task-container__edit-icon']} />
            </Button>
          </>
        )}
      </CardHeader>
      <CardContent className={styles['task-container__content']}>
        <form onSubmit={handleAddTask} className={styles['task-container__form']}>
          <div className={styles['task-container__form-group']}>
            <div className={styles['task-container__form-input-wrapper']}>
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
            <Button type='submit' className={styles['task-container__form-button']} aria-label='Add new task'>
              <Plus className={styles['task-container__edit-icon']} />
              Add Task
            </Button>
          </div>
          {taskError && (
            <p role='alert' className={styles['task-container__error']}>
              {taskError}
            </p>
          )}
        </form>

        {taskList.tasks.length === 0 ? (
          <p className={styles['task-container__no-tasks']} role='status'>
            No tasks yet. Add your first task above!
          </p>
        ) : (
          <>
            <div className={styles['task-container__tabs']}>
              <Tabs
                defaultValue='todo'
                value={filter}
                onValueChange={(value: string) => setFilter(value as TaskStatus)}
                className='w-full'>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='todo'>
                    Todo ({taskList.tasks.filter((t) => t.status === 'todo').length})
                  </TabsTrigger>
                  <TabsTrigger value='doing'>
                    Doing ({taskList.tasks.filter((t) => t.status === 'doing').length})
                  </TabsTrigger>
                  <TabsTrigger value='done'>
                    Done ({taskList.tasks.filter((t) => t.status === 'done').length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {filteredTasks.length > 0 ? (
              <ul className={styles['task-container__tasks']} role='list' aria-label='Task list'>
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
              <p className={styles['task-container__no-tasks']} role='status'>
                No tasks found for the selected filter
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
