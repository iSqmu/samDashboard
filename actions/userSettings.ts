'use server';

import { supabaseServer } from '@/lib/supabase/server';

function encryptApiKey(apiKey: string): string {
  return Buffer.from(apiKey).toString('base64');
}

function decryptApiKey(encryptedKey: string): string {
  return Buffer.from(encryptedKey, 'base64').toString('utf-8');
}

export async function saveUserApiKey(apiKey: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autenticado');
  }


  const encryptedKey = encryptApiKey(apiKey);

  const { data, error } = await supabase
    .from('user_settings')
    .upsert(
      {
        user_id: user.id,
        gemini_api_key: encryptedKey,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    )
    .select();

  if (error) {
    console.error('Error saving API key:', error);
    throw error;
  }

  return { success: true };
}

export async function getUserApiKey(): Promise<string | null> {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('gemini_api_key')
    .eq('user_id', user.id)
    .single();

  if (error || !data || !data.gemini_api_key) {
    return null;
  }

  try {
    return decryptApiKey(data.gemini_api_key);
  } catch (e) {
    console.error('Error decrypting API key:', e);
    return null;
  }
}

export async function deleteUserApiKey() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autenticado');
  }

  const { error } = await supabase
    .from('user_settings')
    .update({ gemini_api_key: null })
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }

  return { success: true };
}
