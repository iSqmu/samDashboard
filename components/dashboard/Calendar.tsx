'use client';
import { clsx } from 'clsx';
import { useMemo, useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import type { Task } from '@/types/database.types';
import { FaLink } from 'react-icons/fa';
import { CiBookmarkCheck, CiBookmark } from 'react-icons/ci';
import Link from 'next/link';
import HighTasks from '@/components/dashboard/HighTasks';
import TodayTasks from '@/components/dashboard/TodayTasks';
import RecentTasksCompleted from '@/components/dashboard/RecentTasksCompleted';

const Calendar = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentMonth, currentYear]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser();

      if (error) throw error;

      setUser(user);
    }

    async function fetchTasks() {
      setLoading(true);
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);

      const { data, error } = await supabaseClient
        .from('tasks')
        .select('*')
        .gte('due_date', firstDay.toISOString())
        .lte('due_date', lastDay.toISOString());

      if (error) throw error;

      setTasks(data || []);
      setLoading(false);
    }
    fetchUser();
    fetchTasks();
  }, [currentMonth, currentYear]);

  const taskCountByDay = useMemo(() => {
    const counts: { [day: number]: { count: number; tasks: Task[] } } = {};

    tasks.forEach((task) => {
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        const day = dueDate.getDate() + 1;

        if (!counts[day]) {
          counts[day] = { count: 0, tasks: [] };
        }

        counts[day].count++;
        counts[day].tasks.push(task);
      }
    });
    return counts;
  }, [tasks]);

  const maxTasksPerDay = useMemo(() => {
    return Math.max(
      ...Object.values(taskCountByDay).map((day) => day.count),
      0,
    );
  }, [taskCountByDay]);

  function getIntesityClass(count: number): string {
    if (count === 0) return 'bg-gray-200';
    const intesity = count / maxTasksPerDay;
    if (intesity < 0.25) return 'bg-blue-200'; // Very low intensity
    if (intesity < 0.5) return 'bg-green-200'; // Low intensity
    if (intesity < 0.75) return 'bg-yellow-200'; // Medium intensity
    return 'bg-red-200'; // Highest intensity
  }

  const calendarGrid = useMemo(() => {
    const grid = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      grid.push(
        <div
          key={`empty-${i}`}
          className="border border-transparent p-2 rounded-lg"
        />,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = taskCountByDay[day];
      const taskCount = dayData?.count || 0;
      const isToday = day === currentDay;
      const isSelected = day === selectedDay;

      grid.push(
        <div
          key={day}
          onClick={() => setSelectedDay(day === selectedDay ? null : day)}
          className={clsx(
            'relative p-3 rounded-lg cursor-pointer transition-all duration-300',
            'hover:scale-110 hover:shadow-lg hover:z-10',
            getIntesityClass(taskCount),
            isToday && 'ring-2 ring-secondary ring-offset-2',
            isSelected && 'ring-2 ring-tertiary ring-offset-2 scale-105',
          )}
          title={`${day} - ${taskCount} tarea${taskCount !== 1 ? 's' : ''}`}
        >
          {day}
        </div>,
      );
    }

    return grid;
  }, [
    daysInMonth,
    firstDayOfWeek,
    currentDay,
    taskCountByDay,
    maxTasksPerDay,
    selectedDay,
  ]);

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const selectedDayTasks = selectedDay
    ? taskCountByDay[selectedDay]?.tasks || []
    : [];

  if (loading) {
    return (
      <div className="Calendar p-5 border-2 rounded-lg m-5 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar bg-light p-5 rounded-lg shadow-md shadow-light/50 text-dark m-5">
      <h1 className="text-3xl font-bold mb-5">
        Bienvenido al dashboard{' '}
        <span className="text-tertiary font-bold">
          {user?.user_metadata?.full_name.split(' ')[0]}
        </span>
      </h1>
      <div className="stats hidden md:grid grid-cols-3 gap-5 mb-10 border-b-2 p-4 border-gray-400">
        <TodayTasks />
        <RecentTasksCompleted />
        <HighTasks />
      </div>

      <div className="head flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold mb-2 text-tertiary">
          {today.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h2>
        <span className="text-gray-500">
          {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} este mes
        </span>
      </div>
      <div className="days grid-cols-7 hidden md:grid py-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-3 text-center">
        {calendarGrid}
      </div>
      <div className="flex items-center justify-center gap-2 my-6 text-xs text-gray-600">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-blue-300 rounded hover:scale-130 cursor-pointer transition-all duration-300"></div>
          <div className="w-4 h-4 bg-green-300 rounded hover:scale-130 cursor-pointer transition-all duration-300"></div>
          <div className="w-4 h-4 bg-yellow-300 rounded hover:scale-130 cursor-pointer transition-all duration-300"></div>
          <div className="w-4 h-4 bg-red-300 rounded hover:scale-130 cursor-pointer transition-all duration-300"></div>
        </div>
        <span>Más</span>
      </div>

      {selectedDay && (
        <div className="p-4 border-t-2 border-gray-400">
          <h3 className="text-xl font-bold text-gray-700">
            Tareas para el{' '}
            {`${selectedDay} de ${today.toLocaleString('es-ES', { month: 'long' })}:`}
          </h3>
          {selectedDayTasks.length === 0 ? (
            <p className="text-gray-400">No hay tareas para este día.</p>
          ) : (
            <div className="tasks">
              {selectedDayTasks.map((task) => (
                <div
                  className="task flex w-full items-center justify-between bg-gray-200 p-4 rounded-lg mb-4 cursor-pointer"
                  key={task.id}
                  title={task.due_hour}
                >
                  <div className="head flex justify-center items-center mr-4">
                    <span>
                      {task.completed ? (
                        <CiBookmarkCheck
                          title="Tarea completada"
                          className="text-green-500 font-bold text-5xl cursor-pointer"
                        />
                      ) : (
                        <CiBookmark className="text-blue-500 font-bold text-5xl cursor-pointer" />
                      )}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold">{task.title}</h3>
                      <p className="text-xs text-gray-600">
                        {task.description
                          ? task.description
                          : 'Sin descripción'}
                      </p>
                    </div>
                  </div>
                  <div className="content flex gap-5">
                    <span
                      title="Prioridad"
                      className={clsx(
                        'w-4 h-4flex items-center justify-center rounded-full cursor-pointer',
                        task.priority === 'low' && 'bg-green-500',
                        task.priority === 'medium' && 'bg-yellow-500',
                        task.priority === 'high' && 'bg-red-500',
                      )}
                    />
                    <Link href={`/tasks?search=${task.title}`}>
                      <FaLink />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div className="text-2xl font-bold text-green-600">
            {Object.values(taskCountByDay).filter((d) => d.count > 0).length}
          </div>
          <div className="text-gray-600">Días activos</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {maxTasksPerDay}
          </div>
          <div className="text-gray-600">Máx por día</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((tasks.length / daysInMonth) * 10) / 10}
          </div>
          <div className="text-gray-600">Promedio/día</div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
