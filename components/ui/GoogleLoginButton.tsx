'use client';

import { supabaseClient } from '@/lib/supabase/client';
import { FaGoogle } from 'react-icons/fa';
import useSignInWithGoogle from '@/hooks/useSignInWithGoogle'

const GoogleLoginButton = () => {
    
  return (
    <button
      onClick={useSignInWithGoogle}
      className="flex items-center justify-center gap-3
        px-6 py-3.5
        bg-white
        text-gray-800
        font-medium
        rounded-lg
        border-2 border-gray-300
        shadow-sm
        hover:shadow-md
        hover:border-tertiary
        
        transition-all duration-200
        active:scale-[0.98]
        cursor-pointer"
    >
      <FaGoogle />
      <span>Continuar con Google</span>
    </button>
  );
};
export default GoogleLoginButton;
