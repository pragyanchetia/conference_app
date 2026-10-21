'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import useUser from '@/hooks/useUser';
import { Button } from './ui/button';

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="relative z-50 flex h-20 w-full items-center justify-between bg-dark-1 px-5 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-2" aria-label="Confo home">
        <Image src="/icons/logo.svg" width={32} height={32} alt="Confo logo" />
        <span className="text-2xl font-extrabold uppercase text-sky-400">Confo</span>
      </Link>
      {user ? (
        <div className="flex items-center gap-3">
          <Link href={`/user/${user.id}`}><Button variant="outline">Home</Button></Link>
          <Button onClick={() => signOut({ callbackUrl: '/login' })} className="bg-sky-400 text-slate-950 hover:bg-sky-500">Sign out</Button>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/login" className="text-slate-200 transition hover:text-sky-300">Login</Link>
          <Link href="/signup" className="rounded-md bg-sky-400 px-4 py-2 text-slate-950 transition hover:bg-sky-500">Sign up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
