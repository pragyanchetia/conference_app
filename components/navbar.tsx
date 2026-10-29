'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react'; 
import { Button } from './ui/button';

type NavbarUser = {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
};

const Navbar = ({ user }: { user: NavbarUser | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="relative z-50 flex min-h-16 w-full items-center justify-between bg-dark-1 px-4 py-3 sm:px-6 lg:px-10">
      <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Confo home" onClick={closeMenu}>
        <Image src="/icons/logo.svg" width={32} height={32} alt="Confo logo" />
        <span className="text-xl font-extrabold uppercase text-sky-400 sm:text-2xl">Confo</span>
      </Link>

      <button
        type="button"
        className="flex size-11 items-center justify-center rounded-md text-slate-100 transition hover:bg-dark-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 md:hidden"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        {isMenuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
      </button>

      <div
        id="primary-navigation"
        className={`${isMenuOpen ? 'flex' : 'hidden md:flex'} absolute left-0 right-0 top-full flex-col gap-3 border-t border-dark-3 bg-dark-1 px-4 py-4 shadow-lg md:static md:w-auto md:flex-row md:items-center md:gap-3 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
      >
        {user ? (
          <>
            <Link href={`/user/${user.id}`} onClick={closeMenu} className="w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto">Home</Button>
            </Link>
            <Button
              onClick={() => {
                closeMenu();
                void signOut({ callbackUrl: '/login' });
              }}
              className="w-full bg-sky-400 text-slate-950 hover:bg-sky-500 md:w-auto"
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={closeMenu} className="rounded-md px-3 py-3 text-sm font-semibold text-slate-200 transition hover:text-sky-300 md:py-2">Login</Link>
            <Link href="/signup" onClick={closeMenu} className="rounded-md bg-sky-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-500 md:py-2">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
