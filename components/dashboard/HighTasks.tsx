'use server';
import { getHighPriorityTasks } from '@/actions/tasks';
const HighTasks = async () => {
  const tasks = await getHighPriorityTasks();
  console.log(tasks);

  return (
    <div className="card grid-rows-2 bg-light/20 border-light border-2 rounded-lg overflow-hidden">
      <div className="title text-lg font-bold mb-4 h-1/3 w-full bg-light text-tertiary p-4 rounded-b-lg flex items-center">
        <h2>Tareas de prioridad Alta:</h2>
      </div>
      <div className="content px-4">
        <span className="text-5xl">
          {tasks.length > 9 ? '+9' : tasks.length}
        </span>
      </div>
    </div>
  );
};

export default HighTasks;
