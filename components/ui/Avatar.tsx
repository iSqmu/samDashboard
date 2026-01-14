'use client';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';
import useSignOut from '@/hooks/useSignOut';
import useUserProfile from '@/hooks/useUserProfile';

const Avatar = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { signOut, isLoading, error } = useSignOut();
  const { profile, loading } = useUserProfile();

  const router = useRouter();

  async function handleLogout() {
    const result = await signOut();
    if (result.success) {
      router.push('/auth');
      router.refresh();
    }
  }

  return (
    <div
      className="overflow-hidden"
      onClick={() => {
        setIsModalOpen(!isModalOpen);
      }}
    >
      <AnimatePresence>
        {isModalOpen ? (
          <motion.div
            key="avatar-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal absolute right-0 top-0 z-50"
          >
            <div className="modal-content overflow-hidden bg-gray-700 shadow-lg h-full text-primary rounded-lg">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="modal-header relative flex flex-col justify-between items-center gap-2 p-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={profile?.foto}
                    alt="Avatar Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="flex flex-col">
                    {profile?.nombre}{' '}
                    <span className="text-xs">{profile?.email}</span>
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="modal-actions flex flex-col bg-gray-700"
              >
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="p-3 text-primary cursor-pointer transition-all duration-300 hover:bg-tertiary hover:text-primary"
                >
                  Cerrar Sesión
                </button>
                <Link
                  href="/dashboard"
                  className="p-3 text-primary text-center cursor-pointer transition-all duration-300 hover:bg-tertiary hover:text-primary"
                >
                  Dashboard
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="avatarLogo cursor-pointer"
          >
            <img
              src={profile?.foto}
              alt="Avatar Logo"
              width={32}
              height={32}
              className="rounded-full border-2"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Avatar;
