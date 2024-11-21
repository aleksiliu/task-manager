'use client';

import { ArrowLeft } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { TaskContainer } from '@/features/task-list/task-container';
import type { TaskList } from '@/types';

export default function SingleTaskList({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [currentList, setCurrentList] = useState<TaskList | null>(null);
  const resolvedParams = use(params);
  const { taskLists, editTaskListName, deleteTaskList, addTask, editTask, deleteTask, changeTaskStatus } =
    useTaskOperations();

  useEffect(() => {
    const paramId = parseInt(resolvedParams.id);
    const list = taskLists.find((list) => list.id === paramId);

    if (list) {
      setCurrentList(list);
    } else if (taskLists.length > 0) {
      router.push('/');
    }
  }, [resolvedParams.id, taskLists, router]);

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
      />
    </div>
  );
}
