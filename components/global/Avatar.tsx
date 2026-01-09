'use client';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const Avatar = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
            <div className="modal-content overflow-hidden bg-primary shadow-lg h-full text-accent">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="modal-header relative flex justify-between items-center gap-2 p-2 cursor-pointer"
              >
                <img
                  src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
                  alt="Avatar Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                Username
              </motion.div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="modal-actions flex flex-col bg-accent rounded-b-lg overflow-hidden"
              >
                <button className="p-3 text-primary cursor-pointer hover:bg-accent transition-all duration-300">
                  Cerrar Sesión
                </button>
                <button className="p-3 text-primary cursor-pointer hover:bg-accent transition-all duration-300">
                  Configuración
                </button>
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
              src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
              alt="Avatar Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Avatar;
