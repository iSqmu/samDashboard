import { supabaseClient } from '@/lib/supabase/client';

export default async function signInWithGoogle() {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.log('error al iniciar sesión:');
  }
}
