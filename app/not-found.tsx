'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import styles from './not-found.module.css';

export default function TaskListNotFound() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Button 
        variant='ghost' 
        onClick={() => router.push('/')} 
        className={styles.backButton}
      >
        <ArrowLeft className={styles.backIcon} />
        Back to Lists
      </Button>

      <Card>
        <div className={styles.cardContent}>
          <div className={styles.content}>
            <h1 className={styles.title}>Task List Not Found</h1>
            <p className={styles.description}>
              The task list you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/')} 
            variant='default'
            className={styles.returnButton}
          >
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}