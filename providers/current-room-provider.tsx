
'use client' 

import { roomType } from '@/components/data-for-lists/data-list';
import { currentRoom } from '@/lib/current-room';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface RoomContextProps {
  currentRoomId?: string;
  previousRoomId?: string;
}

const RoomContext = createContext<RoomContextProps>({});

export const CurrentRoomProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

    const {id} = useParams();
    const pathname= usePathname(); 
    const rid: string = id as string;  
    
  
    
    const [currentRoomId, setCurrentRoomId] = useState<string>(rid);
    const [previousRoomId, setPreviousRoomId] = useState<string>("");

    useEffect(() => {
        // Update previousRoomId when currentRoomId changes (except initial mount)
        if (currentRoomId && currentRoomId !== rid) {
            setPreviousRoomId(currentRoomId);
        }

        // Update currentRoomId when rid changes
        if (rid) {
            setCurrentRoomId(rid);
        }
    }, [rid, currentRoomId]);
    
    const contextValue: RoomContextProps = { currentRoomId, previousRoomId };
    return (
      <RoomContext.Provider value={contextValue}>
          {children}
      </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);
