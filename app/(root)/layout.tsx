import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Confo',
  description: 'Video conference rooms',
  icons: { icon: '/icons/logo.svg' },
};

const HomeLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <main className="relative">
    <div className="flex">
      <section className="flex min-h-screen flex-1 flex-col px-6 pt-10 max-md:pb-14 sm:px-14">
        <div className="w-full">{children}</div>
      </section>
    </div>
  </main>
);

export default HomeLayout;
