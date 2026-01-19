'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Task, CreateTaskInput } from '@/types/database.types';

export async function searchTask(param: string = ''): Promise<Task[]> {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autenticado');
  }

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (param.trim()) {
    query = query.or(`title.ilike.%${param}%,description.ilike.%${param}%,priority.ilike.%${param}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error al buscar tareas', error);
    throw error;
  }

  return data as Task[];
}

export async function getTasks(): Promise<Task[]> {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autenticado');
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as Task[];
}

export async function createTask(task: CreateTaskInput) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No autenticado');

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, completed: false, user_id: user.id }])
    .select();

  if (error) throw error;

  const newTask = data[0] as Task;

  revalidatePath('/tasks');

  return newTask;
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/tasks');

  return { success: true };
}

export async function deleteTask(id: string) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/tasks');

  return { success: true };
}

export async function toggleComplete(id: string, currentCompleted: boolean) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { error } = await supabase
    .from('tasks')
    .update({ completed: !currentCompleted })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/tasks');

  return { success: true };
}
