'use client';
import { supabaseClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function useSingOut() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await supabaseClient.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signOut,
    isLoading,
    error,
  };
}
