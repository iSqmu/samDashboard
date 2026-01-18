'use client';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import '@/styles/component.header.css';
import { User } from '@supabase/supabase-js';

function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav
      className={clsx(
        'header z-50 w-full flex justify-between items-center py-4 px-4 sm:px-6 md:px-8 lg:px-12 font-black',
        dashboardPaths.includes(pathname) ? 'hidden' : 'fixed',
        'backdrop-blur-sm bg-opacity-90',
      )}
    >
      <div className="nav-logo text-2xl">
        <Link href="/">SD</Link>
      </div>
      <ul className="flex gap-10 w-full justify-center">
        <li className="nav-link flex place-items-center gap-1">
          <FaGithub />
          <a
            href="https://www.linkedin.com/in/samuel-g%C3%B3mez-81baa93a6/"
            className="hidden md:flex"
          >
            Github
          </a>
        </li>
        <li className="nav-link flex place-items-center gap-1">
          <FaInstagram />
          <a
            href="https://www.instagram.com/sqmuu_/"
            className="hidden md:flex"
          >
            Instagram
          </a>
        </li>
        <li className="nav-link flex place-items-center gap-1">
          <FaLinkedin />
          <a href="https://github.com/iSqmu" className="hidden md:flex">
            Linkedin
          </a>
        </li>
      </ul>
      <div className="flex justify-end">
        {user ? (
          <Avatar />
        ) : (
          <Link className="nav-link" href={'/auth'}>
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;
