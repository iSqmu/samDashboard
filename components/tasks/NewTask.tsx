'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createTask } from '@/actions/tasks';
import { CreateTaskInput } from '@/types/database.types';

export default function NewTask() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    due_date: '',
    due_hour: '',
    priority: 'low',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.due_date || !formData.due_hour) {
      alert('Completa los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      await createTask(formData);
      setLoading(false);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        due_date: '',
        due_hour: '',
        priority: 'low',
      });
    } catch (err) {
      alert('Error al crear tarea');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-6 py-3 bg-secondary text-light rounded-lg hover:bg-tertiary transition cursor-pointer"
      >
        <FaPlus />
        Añadir tarea
      </button>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-dark/50 text-dark backdrop-blur-lg  flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-light p-8 z-50 rounded-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-tertiary">
              Nueva tarea
            </h2>

            <input
              name="title"
              placeholder="Título"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded outline-none focus:border-secondary transition-all duration-300"
            />

            <textarea
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded outline-none focus:border-secondary transition-all duration-300"
            />

            <div className="flex gap-4">
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded outline-none focus:border-secondary transition-all duration-300"
              />

              <input
                type="time"
                name="due_hour"
                value={formData.due_hour}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded outline-none focus:border-secondary transition-all duration-300"
              />
            </div>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-3 mb-6 border rounded focus:border-secondary transition-all duration-300"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 p-3 bg-gray-300 rounded hover:bg-gray-600 hover:text-light transition-all duration-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 p-3 bg-blue-600 text-white rounded hover:bg-tertiary transition-all duration-300 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="animate-spin ">⏳</span> Creando tarea...
                  </>
                ) : (
                  'crear tarea'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
