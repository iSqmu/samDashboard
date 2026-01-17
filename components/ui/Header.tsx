'use client';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa6';
import { HiMenu, HiX } from 'react-icons/hi';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import '@/styles/component.header.css';
import { User } from '@supabase/supabase-js';

function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dashboardPaths = ['/dashboard', '/tasks', '/assistant', '/settings'];

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);


  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const socialLinks = [
    {
      icon: FaGithub,
      label: 'Github',
      href: 'https://github.com/tu-usuario',
    },
    {
      icon: FaInstagram,
      label: 'Instagram',
      href: 'https://instagram.com/tu-usuario',
    },
    {
      icon: FaLinkedin,
      label: 'Linkedin',
      href: 'https://linkedin.com/in/tu-usuario',
    },
  ];

  return (
    <nav
      className={clsx(
        'header z-50 w-full flex justify-between items-center py-4 px-4 sm:px-6 md:px-8 lg:px-12 font-black',
        dashboardPaths.includes(pathname) ? 'hidden' : 'fixed',
        'backdrop-blur-sm bg-opacity-90'
      )}
    >

      <div className="nav-logo text-xl sm:text-2xl z-50">
        <Link href="/">SD</Link>
      </div>


      <ul className="hidden md:flex gap-6 lg:gap-10 w-full justify-center">
        {socialLinks.map(({ icon: Icon, label, href }) => (
          <li key={label} className="nav-link flex items-center gap-2">
            <Icon className="text-lg lg:text-xl" />
            <a href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          </li>
        ))}
      </ul>


      <div className="hidden md:flex justify-end">
        {user ? (
          <Avatar />
        ) : (
          <Link className="nav-link" href={'/auth'}>
            Ingresar
          </Link>
        )}
      </div>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden z-50 text-2xl p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <HiX /> : <HiMenu />}
      </button>


      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}


      <div
        className={clsx(
          'md:hidden fixed top-0 right-0 h-full w-64 sm:w-80 bg-dark shadow-2xl z-40 transition-transform duration-300 ease-in-out',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          <div className="mb-8 pb-6 border-b border-white/10">
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar />
                <div className="text-sm">
                  <p className="font-semibold">{user.email}</p>
                </div>
              </div>
            ) : (
              <Link
                className="nav-link text-lg block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                href={'/auth'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Ingresar
              </Link>
            )}
          </div>

          <ul className="space-y-2">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="text-xl" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Footer */}
          <div className="mt-auto pb-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center">
              © 2024 SD Dashboard
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;