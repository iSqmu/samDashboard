'use server';

import { supabaseServer } from '@/lib/supabase/server';

// Simple encryption/decryption using environment variable
// In production, consider using a more robust encryption method
function encryptApiKey(apiKey: string): string {
  // For simplicity, we'll use base64 encoding
  // In production, use proper encryption like AES-256
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

  // Encrypt the API key before storing
  const encryptedKey = encryptApiKey(apiKey);

  // Use Supabase client with service role for direct table access
  // Or use RPC function if you prefer
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

  // Decrypt the API key
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
