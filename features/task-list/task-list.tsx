'use client';

import { Check, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const handleEditName = () => {
    if (isEditing) {
      onEditName(taskList.id, editedName);
      setIsEditing(false);
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
    <Card className='mb-4'>
      <CardHeader className='flex flex-row items-center justify-between'>
        {isEditing ? (
          <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className='mr-2 flex-grow' />
        ) : (
          <div className='flex items-center gap-2'>
            <CardTitle>{taskList.name}</CardTitle>
            <Button variant='ghost' size='icon' onClick={() => setIsEditing(true)} className='h-6 w-6'>
              <Edit className='h-4 w-4' />
            </Button>
          </div>
        )}
        <div className='flex space-x-2'>
          {isEditing ? (
            <Button variant='ghost' size='icon' onClick={handleEditName}>
              <Check className='h-4 w-4' />
            </Button>
          ) : (
            <Button variant='ghost' size='icon' onClick={() => onDelete(taskList.id)}>
              <Trash2 className='h-4 w-4' />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className='mb-4 flex space-x-2'>
          <Input
            type='text'
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder='Add a new task'
            className='flex-grow'
          />
          <Button type='submit'>
            <Plus className='mr-2 h-4 w-4' />
            Add Task
          </Button>
        </form>

        {taskList.tasks.length === 0 ? (
          <p className='text-center text-muted-foreground'>No tasks yet. Add your first task above!</p>
        ) : (
          <>
            {taskList.tasks.length >= 2 && (
              <div className='mb-4'>
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
            <ul className='space-y-2'>
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
