// hooks/useUserProfile.ts
'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { GoogleUserMetadata } from '@/types/GoogleUserMetadata';

export default function useUserProfile() {
  const [profile, setProfile] = useState<{
    nombre: string;
    foto: string;
    email?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (user) {
        const meta = user.user_metadata as GoogleUserMetadata;
        setProfile({
          nombre: meta.full_name || user.email?.split('@')[0] || 'Unknown',
          foto: meta.picture || '/default-avatar.jpg',
          email: user.email ?? undefined,
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    fetchUser();

    
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        fetchUser();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { profile, loading };
}