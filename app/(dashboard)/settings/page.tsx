'use client';

import { useState, useEffect } from 'react';
import {
  saveUserApiKey,
  getUserApiKey,
  deleteUserApiKey,
} from '@/actions/userSettings';
import { useSweetAlert } from '@/hooks/UseSweetAlert';
import { Key, Eye, EyeOff, Trash2, Save } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { Loading, ToastSuccess, ToastError } = useSweetAlert();

  useEffect(() => {
    // Check if user has an API key (we'll show masked version)
    const checkApiKey = async () => {
      try {
        const key = await getUserApiKey();
        if (key) {
          // Show masked version
          setApiKey('*'.repeat(20) + ' (ya configurada)');
        }
      } catch (error) {
        console.error('Error checking API key:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkApiKey();
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim() || apiKey.includes('(ya configurada)')) {
      ToastError.fire({
        icon: 'error',
        title: 'Por favor, ingresa una nueva API key',
      });
      return;
    }

    setIsSaving(true);
    Loading.fire({
      icon: 'info',
      title: 'Guardando API key...',
      allowOutsideClick: false,
    });

    try {
      await saveUserApiKey(apiKey.trim());
      Loading.close();
      ToastSuccess.fire({
        icon: 'success',
        title: 'API key guardada correctamente',
      });
      // Mask the key after saving
      setApiKey('*'.repeat(20) + ' (ya configurada)');
      setShowApiKey(false);
    } catch (error: any) {
      Loading.close();
      ToastError.fire({
        icon: 'error',
        title: error.message || 'Error al guardar la API key',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const { Confirm } = useSweetAlert();
    const result = await Confirm.fire({
      title: '¿Eliminar API key?',
      text: 'Esto eliminará tu API key guardada. Deberás configurarla nuevamente para usar el asistente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      Loading.fire({
        icon: 'info',
        title: 'Eliminando API key...',
      });

      try {
        await deleteUserApiKey();
        Loading.close();
        setApiKey('');
        ToastSuccess.fire({
          icon: 'success',
          title: 'API key eliminada correctamente',
        });
      } catch (error: any) {
        Loading.close();
        ToastError.fire({
          icon: 'error',
          title: error.message || 'Error al eliminar la API key',
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-6 bg-gray-50 overflow-y-scroll">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuración</h1>
        <p className="text-gray-600 mb-6">
          Gestiona tu configuración personal y preferencias
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                API Key de Gemini
              </h2>
              <p className="text-sm text-gray-600">
                Tu API key se almacena de forma segura y encriptada
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                API Key de Google Gemini
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Ingresa tu API key de Gemini"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || apiKey.includes('(ya configurada)')}
                />
                {apiKey && !apiKey.includes('(ya configurada)') && (
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Obtén tu API key gratuita en{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div className="flex gap-3">
              {!apiKey.includes('(ya configurada)') && (
                <button
                  onClick={handleSave}
                  disabled={isSaving || !apiKey.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Guardando...' : 'Guardar API Key'}
                </button>
              )}

              {apiKey.includes('(ya configurada)') && (
                <>
                  <button
                    onClick={() => {
                      setApiKey('');
                      setShowApiKey(false);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cambiar API Key
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Tu API key se almacena de forma encriptada en la base de datos
            </li>
            <li>• Solo tú puedes ver y usar tu API key</li>
            <li>• La API key es necesaria para usar el asistente de IA</li>
            <li>
              • Google Gemini ofrece un tier gratuito generoso (60
              requests/minuto)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
