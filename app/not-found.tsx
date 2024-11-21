'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TaskListNotFound() {
  const router = useRouter();

  return (
    <div className='container mt-4 max-w-3xl p-4'>
      <Button variant='ghost' onClick={() => router.push('/')} className='mb-4'>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Lists
      </Button>

      <Card className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold'>Task List Not Found</h1>
          <p className='text-muted-foreground'>The task list you're looking for doesn't exist or has been deleted.</p>
        </div>
        <Button onClick={() => router.push('/')} variant='default'>
          Return to Home
        </Button>
      </Card>
    </div>
  );
}
