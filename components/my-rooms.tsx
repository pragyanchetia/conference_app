'use client'

import { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


import { roomType, userType } from "@/components/data-for-lists/data-list"
import Loader from './Loader'
import { Button } from './ui/button';
import { currentProfile } from '@/lib/current-profile'; 
import useUser from '@/hooks/useUser';
import { Pencil, Search, Settings, Trash2 } from 'lucide-react';
import { currentRoom } from '@/lib/current-room';
import UpdateRoomForm from './forms/update-room-form';

const MyRooms = () => { 

  const {user} = useUser();
  const [isLoading, setLoading] = useState(true);
  const [getRoom, setGetRoom] = useState<roomType[]>([]);

  const router = useRouter();
  

  useEffect(() => {
    const handleGetRoom = async () => {
      try {
        await axios.get('/api/room')
                    .then((res) => 
                      {
                        setGetRoom(res.data)
                        setLoading(false)
                    }
                  ); 
      } catch (error) {
        console.error("Could not load rooms:", error);
      } finally {
        setLoading(false);
      }
    }

    handleGetRoom();
    
  }, []);

  const handleDelete = async(id: string) => {
    try {
      const roomId: string= id as string; 
      const room = await currentRoom(roomId);
      if (!room || user?.id !== room.admin) return;
      
      await axios.delete("/api/room", {data: {id}}); 
      window.location.reload();

    } catch (error) {
      console.log(error);
    }
  };
 
  const handleRouteToRoom = async (roomId: string) => {
    try {
      const profile = await currentProfile();
      if (profile) router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Could not open room:", error);
    }
  }

  return (
    <div className='bg-dark-3 grid grid-row-[1fr_5fr]'>
      <div className='bg-dark-2 font-semibold rounded-xl m-4 p-2 grid grid-cols-[1fr_.1fr]'>
        <div><h1 className='uppercase pl-5'>My rooms</h1></div>
        <div><Search /></div>
      </div>

      <div className='bg-dark-2 flex flex-col rounded-xl mx-4 mb-4 overflow-auto h-[40vh]'>
        { isLoading ? <Loader /> :
          (getRoom.length !== 0) ?
          getRoom.map((getRoom: roomType) => (
            <div key={getRoom.id} className='grid lg:grid-cols-[1fr_.1fr] grid-cols-[.8fr_.1fr]'>
            <Button className='bg-dark-1 grid grid-cols-[1fr_2fr_1fr] p-2 m-2 rounded-xl hover:bg-gray-500 min-w-[70%]' onClick={() => handleRouteToRoom(getRoom.id)}>
                <div className='flex justify-start px-2'>
                  <h1>{getRoom?.name}</h1>
                </div>
                <div className='lg:flex justify-start hidden'>
                  <h1>{getRoom?.inviteCode}</h1>
                </div>
                <div className='flex justify-center pl-9 gap-2'> 
                  {(getRoom.admin === user?.id) ? (
                    <h1>Admin</h1>
                  ):
                    <h1>Member</h1>
                  }
                </div>
            </Button>
            <div className='flex flex-center'>
            {(getRoom.admin === user?.id) ?
              <DropdownMenu>
                <DropdownMenuTrigger className='focus:outline-none hover:text-blue-400'><Settings /></DropdownMenuTrigger>
                <DropdownMenuContent className='bg-dark-1 text-white text-2xl'>
                  <DropdownMenuLabel>Room Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className='flex flex-col items-start justify-center'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='hover:bg-dark-4 grid grid-cols-[.3fr_1fr] w-[20vw] rounded-md gap-2 text-[1.1rem]'><Trash2 /><p>Delete</p></Button>
                      </DialogTrigger>
                      <DialogContent className='text-white bg-transparent border-lg rounded-lg'>
                          <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            <Button className='mt-4 items-center font-semibold border-[2px] bg-red-600 hover:bg-red-700' onClick={()=>handleDelete(getRoom.id)}>Yes, Delete this room</Button>
                          </DialogDescription>
                          </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='hover:bg-dark-4 grid grid-cols-[.3fr_1fr] w-[20vw] rounded-md gap-2 text-[1.1rem]'><Pencil /><p>Edit</p></Button>
                      </DialogTrigger>
                      <DialogContent className='text-white'>
                          <DialogHeader>
                          <DialogTitle></DialogTitle>
                          <DialogDescription>
                            <UpdateRoomForm id={`${getRoom.id}`} />
                          </DialogDescription>
                          </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              :
              <></>
            }                
          </div>
          </div>
          )) : 
          <div>You are not a member of any room</div>
        }
        
      </div>
    </div>
  )
}

export default MyRooms
