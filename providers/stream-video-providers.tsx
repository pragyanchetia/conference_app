'use client';

import { StreamVideo } from '@stream-io/video-react-sdk';
import { usePathname } from 'next/navigation';
import useGetClient from '@/hooks/useGetClient';
import Loader from '@/components/Loader';

const StreamVideoProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { videoClient } = useGetClient();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (!videoClient) {
    if (isAuthPage) return <>{children}</>;
    if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
      return <div className="p-8 text-center text-white">Add NEXT_PUBLIC_STREAM_API_KEY to your environment to use meetings.</div>;
    }
    return <Loader />;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
