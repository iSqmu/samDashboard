'use client';

import type { Task } from '@/types/database.types';
import { easeInOut, motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useTaskActions } from '@/hooks/useTaskActions';
import { FaTrash } from 'react-icons/fa';
import { useSweetAlert } from '@/hooks/UseSweetAlert';
import EditTask from '@/components/tasks/EditTask';
export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const { updateTask, deleteTask, toggleComplete } = useTaskActions();
  const { Loading, ToastError, ToastSuccess } = useSweetAlert();

  return (
    <div className="grid rows-2 gap-10 h-9/10 w-full sm:px-4 px-1 overflow-y-scroll overflow-x-hidden">
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
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: easeInOut }}
                key={task.id}
                className="flex justify-between items-center lg:px-4 lg:py-2 px-2 py-1 bg-white relative text-dark rounded-lg shadow cursor-pointer hover:[&_.info]:opacity-100"
              >
                <div
                  className="content flex justify-between items-center w-full sm:text-lg text-xs"
                  onClick={() => toggleComplete(task.id, task.completed)}
                >
                  <div className="head w-3/5">
                    <h3 className="md:text-xl sm:text-lg text-xs  font-bold">
                      {task.title}
                    </h3>
                    <p className="head-desc text-xs ">
                      {task.description ? task.description : 'Sin descripción'}
                    </p>
                  </div>
                  <div className="info w-2/5 opacity-100 lg:opacity-0 transition-all duration-300">
                    <p>
                      <span className="hidden md:flex font-bold">Fecha:</span>{' '}
                      {task.due_date} {' > '}
                      {task.due_hour}
                    </p>
                    <p>
                      <span className="hidden md:flex font-bold">
                        Prioridad:
                      </span>
                      <span
                        className={clsx(
                          'font-bold',
                          task.priority === 'low'
                            ? 'text-green-700'
                            : task.priority === 'medium'
                              ? 'text-yellow-500'
                              : 'text-red-700',
                        )}
                      >
                        {' '}
                        {task.priority === 'low'
                          ? 'Baja'
                          : task.priority === 'medium'
                            ? 'Media'
                            : 'Alta'}
                      </span>
                    </p>
                    <p>
                      <span className="hidden md:flex font-bold">Creado:</span>
                      <span> {task.created_at?.split('T')[0]}</span>
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
                          : 'bg-red-700',
                    )}
                  />
                </div>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="actions text-xl flex md:flex-row flex-col gap-5 w-1/5 justify-end"
                >
                  <EditTask task={task} />
                  <button
                    onClick={() => {
                      Loading.fire({
                        icon: 'info',
                        title: 'Eliminando tarea...',
                      });
                      deleteTask(task.id)
                        .then(() => {
                          Loading.close();
                          ToastSuccess.fire({
                            icon: 'success',
                            title: 'Tarea eliminada correctamente',
                          });
                        })
                        .catch((err) => {
                          Loading.close();
                          ToastError.fire({
                            icon: 'error',
                            title: 'Error al eliminar tarea',
                          });
                        });
                    }}
                  >
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
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: easeInOut }}
                key={task.id}
                className="flex justify-between items-center lg:px-4 lg:py-2 px-2 py-1 bg-white relative text-dark rounded-lg shadow cursor-pointer hover:[&_.info]:opacity-100"
              >
                <div
                  className="content flex justify-between items-center w-full sm:text-lg text-xs"
                  onClick={() => toggleComplete(task.id, task.completed)}
                >
                  <div className="head w-3/5">
                    <h3 className="md:text-xl sm:text-lg text-xs  font-bold">
                      {task.title}
                    </h3>
                    <p className="head-desc text-xs ">
                      {task.description ? task.description : 'Sin descripción'}
                    </p>
                  </div>
                  <div className="info w-2/5 opacity-100 lg:opacity-0 transition-all duration-300">
                    <p>
                      <span className="hidden md:flex font-bold">Fecha:</span>{' '}
                      {task.due_date} {' > '}
                      {task.due_hour}
                    </p>
                    <p>
                      <span className="hidden md:flex font-bold">
                        Prioridad:
                      </span>
                      <span
                        className={clsx(
                          'font-bold',
                          task.priority === 'low'
                            ? 'text-green-700'
                            : task.priority === 'medium'
                              ? 'text-yellow-500'
                              : 'text-red-700',
                        )}
                      >
                        {' '}
                        {task.priority === 'low'
                          ? 'Baja'
                          : task.priority === 'medium'
                            ? 'Media'
                            : 'Alta'}
                      </span>
                    </p>
                    <p>
                      <span className="hidden md:flex font-bold">Creado:</span>
                      <span> {task.created_at?.split('T')[0]}</span>
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
                          : 'bg-red-700',
                    )}
                  />
                </div>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="actions text-xl flex md:flex-row flex-col gap-5 w-1/5 justify-end"
                >
                  <EditTask task={task} />
                  <button
                    onClick={() => {
                      Loading.fire({
                        icon: 'info',
                        title: 'Eliminando tarea...',
                      });
                      deleteTask(task.id)
                        .then(() => {
                          Loading.close();
                          ToastSuccess.fire({
                            icon: 'success',
                            title: 'Tarea eliminada correctamente',
                          });
                        })
                        .catch((err) => {
                          Loading.close();
                          ToastError.fire({
                            icon: 'error',
                            title: 'Error al eliminar tarea',
                          });
                        });
                    }}
                  >
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
