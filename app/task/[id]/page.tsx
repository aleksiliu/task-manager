'use client';

import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { TaskContainer } from '@/features/task-list/task-container';

export default function SingleTaskList() {
  const router = useRouter();
  const params = useParams();
  const { taskLists, editTaskListName, deleteTaskList, addTask, editTask, deleteTask, changeTaskStatus } =
    useTaskOperations(() => router.push('/'));

  const existingNames = useMemo(() => taskLists.map((list) => list.name), [taskLists]);

  const currentList = useMemo(() => {
    try {
      const paramId = parseInt(params.id as string);
      return taskLists.find((list) => list.id === paramId);
    } catch {
      router.push('/');
      return null;
    }
  }, [params.id, taskLists, router]);

  if (!currentList) {
    return null;
  }

  return (
    <div className='container mt-4 max-w-3xl p-4'>
      <Button variant='ghost' onClick={() => router.push('/')} className='mb-4'>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Lists
      </Button>

      <TaskContainer
        taskList={currentList}
        onEditName={editTaskListName}
        onDelete={deleteTaskList}
        onAddTask={addTask}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onChangeTaskStatus={changeTaskStatus}
        existingNames={existingNames}
      />
    </div>
  );
}
