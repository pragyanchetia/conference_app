'use client';

import { useEffect, useState } from 'react';
import { roomType } from '@/components/data-for-lists/data-list';
import { currentRooms } from '@/lib/current-user-room';

const useGetRoom = () => {
  const [rooms, setRooms] = useState<roomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const getRooms = async () => {
      try {
        const result = await currentRooms();
        if (!cancelled) setRooms(result as roomType[]);
      } catch (error) {
        console.error("Can't get rooms:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void getRooms();
    return () => { cancelled = true; };
  }, []);

  return { rooms, isLoading };
};

export default useGetRoom;
