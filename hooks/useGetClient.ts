'use client';

import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import useUser from './useUser';
import { tokenProvider } from '@/actions/stream.actions';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const useGetClient = () => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id || !API_KEY) return;
    let cancelled = false;
    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user.id,
        name: user.name || user.username || user.id,
        image: user.image || undefined,
      },
      tokenProvider,
    });

    if (!cancelled) setVideoClient(client);
    return () => {
      cancelled = true;
      setVideoClient((current) => current === client ? undefined : current);
      void client.disconnectUser().catch((error) => console.error('Could not disconnect Stream client:', error));
    };
  }, [user?.id, user?.name, user?.username, user?.image]);

  return { videoClient };
};

export default useGetClient;
