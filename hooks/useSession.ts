'use client';

import { useEffect, useState } from 'react';
import { currentProfile } from '@/lib/current-profile';

const useSession = () => {
  const [sessionId, setSessionId] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    const getUser = async () => {
      try {
        const user = await currentProfile();
        if (!cancelled) setSessionId(user?.id);
      } catch (error) {
        console.error("Can't get user:", error);
      }
    };
    void getUser();
    return () => { cancelled = true; };
  }, []);

  return { sessionId };
};

export default useSession;
