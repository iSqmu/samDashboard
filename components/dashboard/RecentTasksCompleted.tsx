import { supabaseClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { Task } from '@/types/database.types';

const TodayTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const today = `${yyyy}-${mm}-${dd}`;

    async function fetchTodayTasks() {
      setLoading(true);

      const { data, error } = await supabaseClient
        .from('tasks')
        .select('*')
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setTasks(data || []);
      setLoading(false);
    }

    fetchTodayTasks();
  }, []);

  loading && <p>Cargando...</p>;

  return (
    <div className="bg-gray-200 rounded-lg p-5 font-bold">
      <h3 className="text-2xl">Completadas recientes:</h3>
      <span className="block text-4xl text-green-500  mb-2">
        {tasks.length}
      </span>
    </div>
  );
};

export default TodayTasks;
