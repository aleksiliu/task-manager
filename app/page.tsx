'use client';

import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { NewTaskListForm } from '@/features/task-list/task-list-form';
import { TaskListPreview } from '@/features/task-list/task-list-preview';
import styles from './page.module.css';

export default function TaskManager() {
  const { taskLists, error, addTaskList, editTaskListName, deleteTaskList } = useTaskOperations();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Task Manager</h1>

      {error && (
        <div className={styles.error} role='alert'>
          <p>{error}</p>
        </div>
      )}

      <NewTaskListForm onSubmit={addTaskList} existingNames={taskLists.map((list) => list.name)} />

      <div className={styles.lists}>
        {taskLists.map((taskList) => (
          <TaskListPreview
            key={taskList.id}
            taskList={taskList}
            onEditName={editTaskListName}
            onDelete={deleteTaskList}
            existingNames={taskLists.map((list) => list.name)}
          />
        ))}
      </div>

      {taskLists.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <ClipboardList className='h-6 w-6' />
          </div>
          <div className={styles.emptyContent}>
            <h3 className={styles.emptyTitle}>No tasks yet</h3>
            <p className={styles.emptyText}>Create your first task list to get started</p>
          </div>
          <Button onClick={() => document.querySelector('input')?.focus()} variant='outline'>
            <Plus />
            Create task list
          </Button>
        </div>
      )}
    </div>
  );
}
