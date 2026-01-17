'use client';
import { useState, useRef, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from '@/types/Gemini.assistant';
import useUserProfile from '@/hooks/useUserProfile';
import clsx from 'clsx';
import { IoSend } from 'react-icons/io5';

export default function AssistantPage() {
  const { profile, loading } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hola! soy el asistente de SamDashboard, puedo ayudarte a crear, mirar, eliminar, actualizar y marcar como completadas tus tareas, no dudes en preguntarme en cualquier momento, aqui estaré para ti',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.error || `Error ${response.status}: Failed to get response`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        functionCalls: data.functionCalls,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error:', err);
      const errorMessage =
        err.message ||
        'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✖️ Error: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="content flex flex-col h-full w-full">
      {/* HEADER */}
      <div className="bg-tertiary px-5 py-4 w-full flex flex-col">
        <h2 className="text-2xl font-bold">SamAssistant</h2>
      </div>
      <div className="chat flex-1 overflow-y-auto p-4 space-y-4 ">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={clsx(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-light flex justify-center items-center text-dark text-2xl">
                  <FaRobot />
                </div>
              )}
              <div
                className={clsx(
                  'max-w-[70%] rounded-lg p-4',
                  msg.role === 'user'
                    ? 'bg-tertiary text-light'
                    : 'bg-light text-dark'
                )}
              >
                <p>{msg.content}</p>
                {msg.functionCalls && msg.functionCalls.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Acciones ejecutadas:
                    </p>
                    {msg.functionCalls.map((func, i) => (
                      <p key={i} className="text-xs text-gray-400 mt-1">
                        - {func.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-dark flex justify-center items-center text-light text-2xl">
                  <img
                    src={profile?.foto}
                    alt="avatar"
                    className="rounded-full"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex gap-3 justify-start"
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-light flex justify-center items-center text-dark text-2xl">
            <FaRobot />
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
      <form
        onSubmit={handleSubmit}
        className="bg-light border-t border-gray text-dark p-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-6 text-dark hover:text-light hover:bg-tertiary rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex  items-center gap-2 transition-all duration-300"
          >
            {isLoading ? <Loader2 /> : <IoSend />}
          </button>
        </div>
      </form>
    </div>
  );
}
