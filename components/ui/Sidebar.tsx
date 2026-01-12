'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaHome, FaCompass, FaTasks, FaBrain } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { IoArrowForward, IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { easeInOut, easeOut } from 'framer-motion';
const sidebarVariants = {
  open: {
    width: '20%', // o '280px' si prefieres fijo
    transition: {
      duration: 0.5,
      ease: easeInOut,
      when: 'beforeChildren', // anima el contenedor antes que los hijos
      staggerChildren: 0.1, // para que los links aparezcan secuencialmente
    },
  },
  closed: {
    width: '100px', // ancho solo para íconos
    transition: {
      duration: 0.5,
      ease: easeInOut,
      when: 'afterChildren',
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
  closed: {
    opacity: 0,
    position: 'absolute',
    x: -200,
    transition: { duration: 0.2 },
  },
};

import clsx from 'clsx';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const links = [
    {
      label: 'Home',
      Icon: FaHome,
      url: '/',
    },
    {
      label: 'Dashboard',
      Icon: FaCompass,
      url: '/dashboard',
    },
    {
      label: 'Tasks',
      Icon: FaTasks,
      url: '/tasks',
    },
    {
      label: 'Assistant',
      Icon: FaBrain,
      url: '/assistant',
    },
    {
      label: 'Settings',
      Icon: IoMdSettings,
      url: '/settings',
    },
  ];
  const pathname = usePathname();
  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false} // evita animación inicial al montar
      animate={isOpen ? 'open' : 'closed'}
      className={clsx(
        'relative left-0 top-0 z-50 h-screen bg-tertiary py-10',
        'shadow-2xl shadow-black/20'
      )}
    >
      <div className="side-logo mb-5 flex justify-center items-center">
        <Link href="/" className="font-black text-lg">
          <h2>SD</h2>
        </Link>
      </div>
      <button
        className="absolute top-100 rounded-full bg-light text-dark left-1/2 -translate-x-1/2 text-3xl cursor-pointer transition-all duratoin-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen ? <IoArrowForward /> : <IoArrowBack />}
      </button>
      <ul className="h-3/4 flex flex-col gap-2 items-left font-black ">
        {links.map(({ label, Icon, url }, index) => (
          <motion.li
            key={index}
            className={clsx(
              'w-full px-4 py-2 shadow-2xl hover:scale-110 hover:translate-x-2 hover:shadow-light hover:rounded-r-lg transtiion-all duration-300',
              pathname === url || (url !== '/' && pathname.startsWith(url))
                ? 'bg-light text-dark'
                : 'hover:bg-light hover:text-dark'
            )}
          >
            <Link
              href={url}
              className={clsx(
                'flex items-center gap-2 text-lg transition-all duratoin-300',
                isOpen === false ? 'justify-center' : ''
              )}
            >
              <Icon className="shrink-0" />
              <motion.span variants={itemVariants}>{label}</motion.span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  );
};

export default Sidebar;
