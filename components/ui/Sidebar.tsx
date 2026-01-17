'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaHome, FaCompass, FaTasks, FaBrain } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { IoArrowForward, IoArrowBack, IoClose } from 'react-icons/io5';
import { HiMenu } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { easeInOut, easeOut } from 'framer-motion';
import clsx from 'clsx';

const sidebarVariants = {
  open: {
    width: '280px',
    transition: {
      duration: 0.5,
      ease: easeInOut,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  closed: {
    width: '80px',
    transition: {
      duration: 0.5,
      ease: easeInOut,
      when: 'afterChildren',
      staggerChildren: 0.05,
    },
  },
};

const mobileSidebarVariants = {
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: easeInOut,
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
    x: -20,
    transition: { duration: 0.2 },
  },
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const pathname = usePathname();

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

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isMobile]);

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 right-4 z-40 p-2 bg-light text-tertiary rounded-full shadow-2xl hover:scale-110 transition-transform"
          aria-label="Abrir menú"
        >
          <HiMenu className="text-2xl" />
        </button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.aside
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed left-0 top-0 z-50 h-screen w-72 bg-tertiary py-6 px-4 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <Link
                  href="/"
                  className="font-black text-2xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SD
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Cerrar menú"
                >
                  <IoClose className="text-2xl" />
                </button>
              </div>

              <ul className="space-y-2">
                {links.map(({ label, Icon, url }, index) => (
                  <li key={index}>
                    <Link
                      href={url}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-bold transition-all',
                        pathname === url ||
                          (url !== '/' && pathname.startsWith(url))
                          ? 'bg-light text-dark shadow-lg'
                          : 'hover:bg-light/10',
                      )}
                    >
                      <Icon className="text-xl" />
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="absolute bottom-6 left-4 right-4">
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-gray-400 text-center">
                    © 2024 SD Dashboard
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className={clsx(
        'relative left-0 top-0 z-50 h-screen bg-tertiary py-10 shadow-2xl shadow-black/20',
        'hidden md:block',
      )}
    >
      <div className="side-logo mb-8 flex justify-center items-center">
        <Link href="/" className="font-black text-xl">
          <h2>SD</h2>
        </Link>
      </div>

      <button
        className={clsx(
          'absolute top-9/10 rounded-full bg-light text-dark left-1/2 -translate-x-1/2',
          'text-2xl p-2 cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg',
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Contraer sidebar' : 'Expandir sidebar'}
      >
        {!isOpen ? <IoArrowForward /> : <IoArrowBack />}
      </button>

      <ul className="h-3/4 flex flex-col gap-2 items-left font-black px-2">
        {links.map(({ label, Icon, url }, index) => (
          <motion.li
            key={index}
            className={clsx(
              'w-full rounded-lg shadow-lg transition-all duration-300',
              'hover:scale-105 hover:shadow-xl',
              pathname === url || (url !== '/' && pathname.startsWith(url))
                ? 'bg-light text-dark'
                : 'hover:bg-light hover:text-dark',
            )}
          >
            <Link
              href={url}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 text-base transition-all duration-300',
                !isOpen && 'justify-center',
              )}
            >
              <Icon className="shrink-0 text-xl" />
              {isOpen && (
                <motion.span
                  variants={itemVariants}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {label}
                </motion.span>
              )}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  );
};

export default Sidebar;
