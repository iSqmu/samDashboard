'use client';
import { LogIn, UserRoundPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Avatar from '@/components/global/Avatar';
import Link from 'next/link';
import '@/styles/component.header.css';
function Header() {
  let isHome: boolean = usePathname() === '/' || usePathname() === '/Auth';
  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-accent text-primary">
      <Link href="/" className="logo text-2xl font-bold">
        SD
      </Link>
      {isHome ? (
        <div className="Auth flex justify-center rounded-md font-bold">
          <Link
            href="/Auth"
            className="flex w-20 justify-center gap-2 py-0.5 px-1 text-center text-accent bg-primary rounded-md hover:bg-accent hover:text-white hover:scale-110 hover:shadow-primary hover:shadow-md transition-all duration-300 ease-in-out"
            id="login"
          >
            <LogIn className="logobtn" />
            <span>Ingresar</span>
          </Link>
        </div>
      ) : (
        <Avatar />
      )}
    </nav>
  );
}

export default Header;
