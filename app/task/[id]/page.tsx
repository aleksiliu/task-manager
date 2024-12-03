'use client';

import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { TaskContainer } from '@/features/task-list/task-container';
import styles from './page.module.css';

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
    <div className={`container ${styles.root}`}>
      <div className={styles.header}>
        <Button variant='ghost' onClick={() => router.push('/')} className={styles.back}>
          <ArrowLeft className={styles.backIcon} />
          Back to Lists
        </Button>
      </div>

      <div className={styles.content}>
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
    </div>
  );
}
