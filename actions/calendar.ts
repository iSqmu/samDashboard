'use server';

import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import type { Task } from '@/types/database.types';

export async function syncTaskToCalendar(task: Task) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Necesitas iniciar sesión con Google primero');
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: session.access_token,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const startDate = new Date(`${task.due_date}T${task.due_hour}`);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);

  const event = {
    summary: task.title,
    description: task.description || '',
    start: { dateTime: startDate.toISOString() },
    end: { dateTime: endDate.toISOString() },
    reminders: { useDefault: true },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return {
    success: true,
    eventId: response.data.id,
    message: 'Tarea sincronizada en Google Calendar',
  };
}