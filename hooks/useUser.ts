'use client';

import { useEffect, useState } from 'react';
import { userType } from '@/components/data-for-lists/data-list';
import { currentProfile } from '@/lib/current-profile';

const useUser = () => {
  const [user, setUser] = useState<userType>();

  useEffect(() => {
    let cancelled = false;
    const getUser = async () => {
      try {
        const profile = await currentProfile();
        if (!cancelled && profile) setUser(profile as userType);
      } catch (error) {
        console.error("Can't get user:", error);
      }
    };
    void getUser();
    return () => { cancelled = true; };
  }, []);

  return { user };
};

export default useUser;
