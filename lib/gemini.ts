import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Task, CreateTaskInput } from '@/types/database.types';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
} from '@/lib/actions/tasks';

export const taskFunctions = [
  {
    name: 'getTasks',
    description:
      'Get all tasks for the current user and return a list with their details.',
    parameters: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'createTask',
    description:
      'Create a new task for the current user and return the task details ,requires title, priority (low | medium | high), due_date (YYYY-MM-DD), due_hour (HH:MM), description is optional.',
    parameters: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string' as const,
          description: 'The title of the task',
        },
        priority: {
          type: 'string' as const,
          enum: ['low', 'medium', 'high'],
          description: 'The priority of the task',
        },
        due_date: {
          type: 'string' as const,
          description: `The due date of the task in YYYY-MM-DD format tomorrow is the default value will be: ${
            new Date(new Date().setDate(new Date().getDate() + 1))
              .toISOString()
              .split('T')[0]
          }`,
        },
        due_hour: {
          type: 'string' as const,
          description: `The due hour of the task in HH:MM format (24-hour) the default value will be: ${new Date().getHours()}:${new Date().getMinutes()}`,
        },
        description: {
          type: 'string' as const,
          description: 'The description of the task',
        },
      },
      required: ['title', 'priority', 'due_date'],
    },
  },
  {
    name: 'updateTask',
    description:
      'Update an existing task. Provide the task ID and the fields to update',
    parameters: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The ID of the task to update',
        },
        title: {
          type: 'string' as const,
          description: 'New title for the task',
        },
        description: {
          type: 'string' as const,
          description: 'New description for the task',
        },
        priority: {
          type: 'string' as const,
          enum: ['low', 'medium', 'high'],
          description: 'New priority level',
        },
        due_date: {
          type: 'string' as const,
          description: 'New due date in YYYY-MM-DD format',
        },
        due_hour: {
          type: 'string' as const,
          description: 'New due time in HH:MM format',
        },
        completed: {
          type: 'boolean' as const,
          description: 'Whether the task is completed',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'deleteTask',
    description: 'Delete a task by its ID.',
    parameters: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The ID of the task to delete',
        },
      },
    },
  },
  {
    name: 'toggleComplete',
    description:
      'Toggle the completion status of a task. Provide the task ID and current completed status',
    parameters: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The ID of the task',
        },
        currentCompleted: {
          type: 'boolean' as const,
          description: 'The current completion status of the task',
        },
      },
      required: ['id', 'currentCompleted'],
    },
  },
];

async function executeFunction(functionName: string, args: any) {
  try {
    switch (functionName) {
      case 'getTasks': {
        const tasks = await getTasks();
        return {
          success: true,
          message: 'Tasks retrieved successfully',
          data: tasks,
        };
      }

      case 'createTask': {
        const newTask = await createTask(args as CreateTaskInput);
        return {
          success: true,
          message: 'Task created successfully',
          data: newTask,
        };
      }

      case 'updateTask': {
        const { id, ...updates } = args;
        await updateTask(id, updates);
        return {
          success: true,
          message: 'Task updated successfully',
          taskId: id,
        };
      }

      case 'deleteTask': {
        await deleteTask(args.id);
        return {
          success: true,
          message: 'Task deleted successfully',
          taskId: args.id,
        };
      }

      case 'toggleComplete': {
        await toggleComplete(args.id, args.currentCompleted);
        return {
          success: true,
          message: 'Task completion status toggled',
          taskId: args.id,
          completed: !args.currentCompleted,
        };
      }

      default: {
        return {
          success: false,
          error: `Unknown function: ${functionName}`,
        };
      }
    }
  } catch (err) {
    return {
      success: false,
      error: `Error executing ${functionName}: ${err}`,
    };
  }
}

export async function chatWithGemini(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  apiKey?: string | null,
) {
  if (!apiKey) {
    throw new Error(
      'El api key de Gemini no está configurado, por favor, agrega tu API key en el panel de configuración.',
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `Eres un asistente de tareas útil y conversacional. Puedes ayudar al usuario de dos formas:

1. **Responder preguntas generales**: Puedes responder cualquier pregunta, tener conversaciones normales, dar consejos, explicar conceptos, etc. Sé amigable y conversacional.

2. **Gestionar tareas (usando funciones)**: Cuando el usuario quiera crear, ver, actualizar o eliminar tareas, usa las funciones disponibles:
      - Para crear una tarea: usa createTask con título, prioridad (low/medium/high), fecha (YYYY-MM-DD) y hora (HH:MM)
      - Para ver tareas: usa getTasks
      - Para actualizar: usa updateTask con el ID de la tarea
      - Para eliminar: usa deleteTask con el ID
      - Para marcar como completada: usa toggleComplete

Usa las funciones SOLO cuando el usuario quiera realizar acciones CRUD en las tareas. Para todo lo demás, responde normalmente como un asistente conversacional.`,
      tools: [
        {
          functionDeclarations: taskFunctions as any,
        },
      ],
    });

    const historyMessages = messages.slice(0, -1);
    const userMessage = messages[messages.length - 1];

    let firstUserIndex = -1;
    for (let i = 0; i < historyMessages.length; i++) {
      if (historyMessages[i].role === 'user') {
        firstUserIndex = i;
        break;
      }
    }

    const validHistory =
      firstUserIndex >= 0 ? historyMessages.slice(firstUserIndex) : [];

    const geminiHistory: Array<{
      role: 'user' | 'model';
      parts: Array<{ text: string }>;
    }> = [];

    for (let i = 0; i < validHistory.length; i++) {
      const msg = validHistory[i];
      geminiHistory.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    const chat = model.startChat({
      history: geminiHistory.length > 0 ? geminiHistory : undefined,
    });

    const result = await chat.sendMessage(userMessage.content);
    const res = result.response;

    const functionCalls: any[] = [];
    let finalResponse = '';

    let functionCallsList: any[] = [];

    try {
      const calls = res.functionCalls();
      if (calls) {
        functionCallsList = Array.isArray(calls) ? calls : [calls];
      }
    } catch (err) {
      console.log('Error getting function calls:');
    }

    if (functionCallsList.length === 0 && res.candidates) {
      for (const candidate of res.candidates) {
        if (candidate.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.functionCall) {
              functionCallsList.push(part.functionCall);
            }
          }
        }
      }
    }

    if (functionCallsList && functionCallsList.length > 0) {
      for (const functionCall of functionCallsList) {
        const functionName = functionCall.name || functionCall.functionName;
        const args = functionCall.args || functionCall.args || {};

        if (functionName) {
          functionCalls.push({
            name: functionName,
            args,
          });

          const functionRes = await executeFunction(functionName, args);

          let parsedResult: any = functionRes;

          if (typeof functionRes === 'string') {
            try {
              parsedResult = JSON.parse(functionRes);
            } catch {
              parsedResult = { result: functionRes };
            }
          }

          const followUpResult = await chat.sendMessage([
            {
              functionResponse: {
                name: functionName,
                response: parsedResult,
              },
            },
          ]);

          const followUpText = followUpResult.response.text();

          if (followUpText) {
            finalResponse = followUpText;
          } else {
            console.warn('Function call without name:', functionCall);
          }
        }
      }
    } else {
      const text = res.text();
      if (text) {
        finalResponse = text;
      } else {
        finalResponse =
          'No pude generar una respuesta. Por favor, intenta reformular tu pregunta.';
      }
    }

    if (!finalResponse) {
      finalResponse =
        'No pude generar una respuesta. Por favor, intenta reformular tu pregunta.';
    }

    return {
      response: finalResponse,
      functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
    };
  } catch (err: any) {
    console.error('Error in chatWithGemini:', err);

    if (err.message?.includes('API_KEY')) {
      throw new Error(
        'API key inválida. Por favor, verifica tu API key en el panel de configuración',
      );
    }

    if (err.message?.includes('quota') || err.message?.includes('limit')) {
      throw new Error(
        'Se ha excedido el límite de peticiones. Por favor, intenta de nuevo más tarde.',
      );
    }

    if (err.message?.includes('permission') || err.message?.includes('403')) {
      throw new Error(
        'No tienes permisos para usar esta API. Por favor verifica tu API key.',
      );
    }

    throw new Error(
      err.message ||
        'Error al comunicarse con la API de Gemini. Por favor, intenta de nuevo.',
    );
  }
}
