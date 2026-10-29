
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conference",
  description: "Virtual Meeting Rooms",
  icons: {
    icon: "/icons/logo.svg",
  },
};

type SessionUser = {
  id?: string;
  name?: string | null;
  image?: string | null;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const sessionUser = session?.user as SessionUser | undefined;

  const navbarUser = sessionUser?.id
    ? {
        id: sessionUser.id,
        name: sessionUser.name ?? null,
        username: null,
        image: sessionUser.image ?? null,
      }
    : null;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-2`}>
        <Navbar user={navbarUser} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
