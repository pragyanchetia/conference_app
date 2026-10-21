import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import { Toaster } from "@/components/ui/toaster";

import "@stream-io/video-react-sdk/dist/css/styles.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conference",
  description: "Virtual Meeting Rooms",
  icons: {
    icon: '/icons/logo.svg',
  }
};

import 'react-datepicker/dist/react-datepicker.css'
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={`${inter.className} bg-dark-2`}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </html>
  );
}
