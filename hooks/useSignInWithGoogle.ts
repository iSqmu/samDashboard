import { supabaseClient } from '@/lib/supabase/client';

export default async function signInWithGoogle() {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      // scopes: 'https://www.googleapis.com/auth/calendar.events',
      // queryParams: {
      //   access_type: 'offline',
      //   prompt: 'consent',
      // },
    },
  });

  if (error) {
    console.log('error al iniciar sesión:');
  }
}
