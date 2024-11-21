import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface NewTaskListFormProps {
  onSubmit: (name: string) => void;
}

export function NewTaskListForm({ onSubmit }: NewTaskListFormProps) {
  const [newListName, setNewListName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim() && newListName.length <= 60) {
      onSubmit(newListName.trim());
      setNewListName('');
    }
  };

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Create New Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='flex space-x-2'>
          <Input
            type='text'
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder='New task list name'
            className='flex-grow'
            maxLength={60}
          />
          <Button type='submit'>
            <Plus className='mr-2 h-4 w-4' />
            Add List
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
