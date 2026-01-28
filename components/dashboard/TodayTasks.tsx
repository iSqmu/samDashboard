import { supabaseClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { Task } from '@/types/database.types';

const TodayTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTodayTasks() {
      setLoading(true);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const { data, error } = await supabaseClient
        .from('tasks')
        .select('*')
        .gte('deadline', todayStart.toISOString())
        .lte('deadline', todayEnd.toISOString())
        .eq('completed', false);

        console.log(data)

      if (error) throw error;

      setTasks(data || []);
      setLoading(false);
    }

    fetchTodayTasks();
  }, []);

  loading && <p>Cargando...</p>;

  return (
    <div className="bg-gray-200 rounded-lg p-5 font-bold">
      <h3 className="text-2xl">Tareas para hoy:</h3>
      <span className="block text-4xl text-tertiary  mb-2">{tasks.length}</span>
    </div>
  );
};

export default TodayTasks;
