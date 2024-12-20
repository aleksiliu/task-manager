'use client';

import { Check, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TASK_CONSTRAINTS, cn, truncateText } from '@/lib/utils';
import { useFormValidation } from '@/hooks/use-form-validation';
import type { TaskList, TaskStatus } from '@/types';
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

    const otherNames = existingNames.filter((name) => name !== taskList.name);
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
    <Card
      className='mb-4 shadow-md transition-all hover:shadow-lg'
      role='region'
      aria-label={`Task list: ${taskList.name}`}>
      <CardHeader className='flex flex-row items-center justify-between'>
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
                  setNameError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                maxLength={TASK_CONSTRAINTS.LIST_NAME.MAX_LENGTH}
                className={cn('flex-grow', nameError && 'border-red-500')}
                aria-invalid={nameError ? 'true' : 'false'}
              />
              <Button variant='ghost' size='icon' onClick={handleSubmit} aria-label='Save list name'>
                <Check className='h-4 w-4' />
              </Button>
            </div>
            {nameError && (
              <p role='alert' className='text-sm text-red-500'>
                {nameError}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className='flex items-center gap-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <CardTitle className='max-w-[200px] truncate sm:max-w-none' title={taskList.name}>
                    {truncateText(taskList.name)}
                  </CardTitle>
                </PopoverTrigger>
                <PopoverContent className='p-3 text-sm sm:hidden'>
                  <div className='break-words font-medium'>{taskList.name}</div>
                </PopoverContent>
              </Popover>

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
      <CardContent>
        <form onSubmit={handleAddTask} className='mb-4 flex flex-col gap-2'>
          <div className='flex space-x-2'>
            <div className='flex-grow'>
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
                className={cn('w-full', taskError && 'border-red-500')}
                aria-invalid={taskError ? 'true' : 'false'}
              />
            </div>
            <Button type='submit' aria-label='Add new task'>
              <Plus className='h-4 w-4' />
              Add Task
            </Button>
          </div>
          {taskError && (
            <p role='alert' className='text-sm text-red-500'>
              {taskError}
            </p>
          )}
        </form>

        {taskList.tasks.length === 0 ? (
          <p className='text-center text-muted-foreground' role='status'>
            No tasks yet. Add your first task above!
          </p>
        ) : (
          <>
            <div className='mb-4'>
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
              <ul className='space-y-2' role='list' aria-label='Task list'>
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
              <p className='text-center text-muted-foreground' role='status'>
                No tasks found for the selected filter
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
