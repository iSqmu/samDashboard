'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Task, CreateTaskInput } from '@/types/database.types';
import { syncTaskToCalendar } from './calendar'; // Asegúrate de tener este archivo

export async function getTodayTasks(): Promise<Task[]> {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No autenticado');

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('due_date', todayStr)
    .order('due_hour', { ascending: true });

  if (error) {
    console.error('Error fetching today tasks:', error);
    throw error;
  }

  return data as Task[];
}

export async function getRecentTasksCompleted(): Promise<Task[]> {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No autenticado');

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('updated_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching recent completed tasks:', error);
    throw error;
  }

  return data as Task[];
}

export async function getHighPriorityTasks(): Promise<Task[]> {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No autenticado');

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('priority', 'high')
    .limit(10);

  if (error) {
    console.error('Error fetching high priority tasks:', error);
    throw error;
  }

  return data as Task[];
}

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
    query = query.or(`title.ilike.%${param}%,description.ilike.%${param}%`);
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

  try {
    await syncTaskToCalendar(newTask);
    console.log('Tarea sincronizada en Google Calendar:', newTask.title);
  } catch (calendarError) {
    console.error('Fallo al sincronizar con Calendar:', calendarError);
  }

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
