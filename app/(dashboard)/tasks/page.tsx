import TaskList from '@/components/tasks/TaskList';
import Search from '@/components/tasks/Search';
import NewTaskClient from '@/components/tasks/NewTask';
import { getTasks, searchTask } from '@/lib/actions/tasks';
import { headers } from 'next/headers';

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const searchTerm = typeof params.search === 'string' ? params.search : '';

  const tasks = searchTerm ? await searchTask(searchTerm) : await getTasks();

  return (
    <div className="w-full h-full p-6 overflow-y-hidden overflow-x-hidden">
      <div className="flex justify-start md:justify-between gap-5 items-center mb-8">
        <Search placeholder="Buscar tarea..." />
        <NewTaskClient />
      </div>
      <p className="text-gray-400 my-4 px-4">
        Haz click en la tarea para marcarla como completada/sin completar
      </p>
      {tasks.length === 0 && searchTerm !== '' ? (
        <p>
          No se encontraron tareas con el término de búsqueda: '{searchTerm}'
        </p>
      ) : (
        <TaskList initialTasks={tasks} />
      )}
    </div>
  );
}
