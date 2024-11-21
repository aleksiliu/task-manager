'use client';

import { Check, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useFormValidation } from '@/hooks/use-form-validation';
import type { TaskList, TaskStatus } from '@/types';
import { TaskItem } from './task-item';

interface TaskListProps {
  taskList: TaskList;
  onEditName: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  onAddTask: (listId: number, description: string) => void;
  onEditTask: (listId: number, taskId: number, description: string) => void;
  onDeleteTask: (listId: number, taskId: number) => void;
  onChangeTaskStatus: (listId: number, taskId: number, status: TaskStatus) => void;
}

export function TaskListComponent({
  taskList,
  onEditName,
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onChangeTaskStatus
}: TaskListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(taskList.name);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const { error, validateTaskList, setError } = useFormValidation();

  const handleEditName = () => {
    if (isEditing) {
      if (validateTaskList(editedName, [])) {
        onEditName(taskList.id, editedName);
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskDescription.trim()) {
      onAddTask(taskList.id, newTaskDescription.trim());
      setNewTaskDescription('');
    }
  };

  const filteredTasks = taskList.tasks.filter((task) => filter === 'all' || task.status === filter);

  return (
    <Card
      className='mb-4 shadow-lg transition-all hover:shadow-xl'
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
                  setError(null);
                }}
                className={cn('flex-grow', error && 'border-red-500')}
                aria-invalid={error ? 'true' : 'false'}
              />
              <Button variant='ghost' size='icon' onClick={handleEditName} aria-label='Save list name'>
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
              <CardTitle>{taskList.name}</CardTitle>
              <Button variant='ghost' size='icon' onClick={() => setIsEditing(true)} className='h-6 w-6'>
                <Edit className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex space-x-2'>
              <Button variant='ghost' size='icon' onClick={() => onDelete(taskList.id)}>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className='mb-4 flex space-x-2'>
          <div className='flex-grow'>
            <label className='sr-only' htmlFor={`new-task-${taskList.id}`}>
              Add new task
            </label>
            <Input
              id={`new-task-${taskList.id}`}
              type='text'
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder='Add a new task'
              className='w-full'
            />
          </div>
          <Button type='submit' aria-label='Add new task'>
            <Plus className='mr-2 h-4 w-4' />
            Add Task
          </Button>
        </form>

        {taskList.tasks.length === 0 ? (
          <p className='text-center text-muted-foreground' role='status'>
            No tasks yet. Add your first task above!
          </p>
        ) : (
          <>
            {taskList.tasks.length >= 2 && (
              <div className='mb-4'>
                <label className='sr-only' htmlFor={`filter-${taskList.id}`}>
                  Filter tasks
                </label>
                <Select value={filter} onValueChange={(value: TaskStatus | 'all') => setFilter(value)}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Filter tasks' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='todo'>Todo</SelectItem>
                    <SelectItem value='doing'>Doing</SelectItem>
                    <SelectItem value='done'>Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
