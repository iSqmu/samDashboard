// hooks/useTaskActions.ts
'use client';

import { useRouter } from 'next/navigation';
import {
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
} from '@/lib/actions/tasks';
import type { CreateTaskInput, Task } from '@/types/database.types';

export function useTaskActions() {
  const router = useRouter();

  const handleCreate = async (task: CreateTaskInput) => {
    await createTask(task);
    router.refresh();
  };

  const handleUpdate = async (id: string, updates: Partial<Task>) => {
    await updateTask(id, updates);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    router.refresh();
  };

  const handleToggle = async (id: string, currentCompleted: boolean) => {
    await toggleComplete(id, currentCompleted);
    router.refresh();
  };

  return {
    createTask: handleCreate,
    updateTask: handleUpdate,
    deleteTask: handleDelete,
    toggleComplete: handleToggle,
  };
}
