'use client';

import type { Task } from '@/types/database.types';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useTaskActions } from '@/hooks/useTaskActions';
import { FaTrash } from 'react-icons/fa';
import EditTask from '@/components/tasks/EditTask';
export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const { updateTask, deleteTask, toggleComplete } = useTaskActions();

  return (
    <div className="grid rows-2 gap-10 h-9/10 w-full px-4 overflow-y-scroll">
      <div className="pendientTasks flex flex-col gap-5 ">
        <h2 className="font-bold text-xl">Tareas pendientes:</h2>
        {initialTasks.filter((t) => t.completed === false).length === 0 ? (
          <p className="text-gray-500">Aquí apareceran las tareas pendientes</p>
        ) : (
          initialTasks
            .filter((t) => t.completed === false)
            .map((task) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeIn' }}
                exit={{ opacity: 0, x: -10 }}
                key={task.id}
                className="flex justify-between items-center p-4 bg-white relative text-dark rounded-lg shadow cursor-pointer hover:[&_.info]:opacity-100"
              >
                <div
                  className="content flex justify-between items-center w-full"
                  onClick={() => toggleComplete(task.id, task.completed)}
                >
                  <div className="head w-3/5">
                    <h3 className="text-xl font-bold">{task.title}</h3>
                    <p className="head-desc text-xs ">
                      {task.description ? task.description : 'Sin descripción'}
                    </p>
                  </div>
                  <div className="info w-2/5 opacity-0 transition-all duration-300">
                    <p>
                      <span className="font-bold">Fecha:</span> {task.due_date}{' '}
                      {' > '}
                      {task.due_hour}
                    </p>
                    <p>
                      <span className="font-bold">Prioridad:</span>
                      <span
                        className={clsx(
                          'font-bold',
                          task.priority === 'low'
                            ? 'text-green-700'
                            : task.priority === 'medium'
                            ? 'text-yellow-500'
                            : 'text-red-700'
                        )}
                      >
                        {task.priority === 'low'
                          ? 'Baja'
                          : task.priority === 'medium'
                          ? 'Media'
                          : 'Alta'}
                      </span>
                    </p>
                  </div>

                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeIn' }}
                    exit={{ opacity: 0 }}
                    className={clsx(
                      'h-full w-2 absolute top-0 -left-1 -z-1 rounded-l-2xl drop-shadow-2xl',
                      task.priority === 'low'
                        ? 'bg-green-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-red-700'
                    )}
                  />
                </div>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="actions text-xl flex gap-5 w-1/5 justify-end"
                >
                  <EditTask task={task} />
                  <button onClick={() => deleteTask(task.id)}>
                    <FaTrash className="text-red-500 opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer" />
                  </button>
                </div>
              </motion.div>
            ))
        )}
      </div>
      <div className="completedTasks flex flex-col gap-5 ">
        <h2 className="font-bold text-xl">Tareas completadas:</h2>
        {initialTasks.filter((t) => t.completed === true).length === 0 ? (
          <p className="text-gray-500">
            Aquí apareceran las tareas completadas
          </p>
        ) : (
          initialTasks
            .filter((t) => t.completed === true)
            .map((task) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeIn' }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => toggleComplete(task.id, task.completed)}
                key={task.id}
                className="flex justify-between items-center p-4 bg-white relative text-dark rounded-lg shadow cursor-pointer hover:[&_.info]:opacity-100"
              >
                <div className="head w-3/5">
                  <h3 className="text-xl font-bold">{task.title}</h3>
                  <p className="head-desc text-xs ">
                    {task.description ? task.description : 'Sin descripción'}
                  </p>
                </div>
                <div className="info w-2/5 opacity-0 transition-all duration-300">
                  <p>
                    <span className="font-bold">Fecha:</span> {task.due_date}{' '}
                    {' > '}
                    {task.due_hour}
                  </p>
                  <p>
                    <span className="font-bold">Prioridad:</span>
                    <span
                      className={clsx(
                        'font-bold',
                        task.priority === 'low'
                          ? 'text-green-700'
                          : task.priority === 'medium'
                          ? 'text-yellow-500'
                          : 'text-red-700'
                      )}
                    >
                      {task.priority === 'low'
                        ? 'Baja'
                        : task.priority === 'medium'
                        ? 'Media'
                        : 'Alta'}
                    </span>
                  </p>
                </div>

                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeIn' }}
                  exit={{ opacity: 0 }}
                  className={clsx(
                    'h-full w-2 absolute top-0 -left-1 -z-1 rounded-l-2xl drop-shadow-2xl',
                    task.priority === 'low'
                      ? 'bg-green-700'
                      : task.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-red-700'
                  )}
                />
                <div className="actions text-xl flex gap-5 w-1/5 justify-end">
                  <EditTask task={task} />

                  <button onClick={() => deleteTask(task.id)}>
                    <FaTrash className="text-red-500 opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer" />
                  </button>
                </div>
              </motion.div>
            ))
        )}
      </div>
    </div>
  );
}
