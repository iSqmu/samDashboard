'use client';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa6';

import '@/styles/component.header.css';
import { User } from '@supabase/supabase-js';

function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtiene la sesión inicial
    supabaseClient.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Escucha cambios en tiempo real (inicio/cierre de sesión)
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpieza al desmontar
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="header z-100 w-full flex justify-between place-items-center py-4 px-6 font-black ">
      <div className="nav-logo text-2xl">
        <Link href="/">SD</Link>
      </div>
      <ul className="flex gap-10 w-full justify-center">
        <li className="nav-link flex place-items-center gap-1">
          <FaGithub />
          <a href="#">Github</a>
        </li>
        <li className="nav-link flex place-items-center gap-1">
          <FaInstagram />
          <a href="#">Instagram</a>
        </li>
        <li className="nav-link flex place-items-center gap-1">
          <FaLinkedin />
          <a href="#">Linkedin</a>
        </li>
      </ul>
      <div className=" flex justify-end">
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
