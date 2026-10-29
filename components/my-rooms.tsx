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

import Loader from './Loader'
import { Button } from './ui/button'; 
import useUser from '@/hooks/useUser';
import { Pencil, Search, Settings, Trash2 } from 'lucide-react';
import { roomType } from "@/components/data-for-lists/data-list";

import UpdateRoomForm from './forms/update-room-form';

const MyRooms = () => { 

  const {user} = useUser();
  const [isLoading, setLoading] = useState(true);
  const [getRoom, setGetRoom] = useState<roomType[]>([]);

  const router = useRouter();
  


  useEffect(() => {
    let cancelled = false;

    const handleGetRoom = async () => {
      try {
        const response = await axios.get<roomType[]>("/api/room");

        if (!cancelled) {
          setGetRoom(response.data);
        }
      } catch (error) {
        console.error("Could not load rooms:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void handleGetRoom();

    return () => {
      cancelled = true;
    };
  }, []);



  const handleDelete = async (id: string) => {
    try {
      await axios.delete("/api/room", { data: { id } });

      // Update the list immediately instead of reloading the whole page.
      setGetRoom((rooms) => rooms.filter((room) => room.id !== id));
    } catch (error) {
      console.error("Could not delete room:", error);
    }
  };
  
  const handleRouteToRoom = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="flex h-[420px] min-w-0 flex-col rounded-2xl border border-white/5 bg-dark-3 p-1 shadow-lg sm:h-[460px]">
      <div className="m-2 flex items-center justify-between gap-3 rounded-xl bg-dark-2 px-4 py-3 sm:m-3 sm:px-5">
        <div className="min-w-0">
          <h1 className="text-sm font-bold uppercase tracking-wide sm:text-base">My rooms</h1>
          <p className="mt-1 text-xs text-slate-400">{getRoom.length} {getRoom.length === 1 ? 'room' : 'rooms'}</p>
        </div>
        <Search className="shrink-0 text-slate-400" aria-hidden="true" />
      </div>

      <div className="mx-2 mb-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-xl bg-dark-2 p-2 sm:mx-3 sm:mb-3 sm:p-3">
        {isLoading ? <Loader className="h-full min-h-[240px]" /> :
          (getRoom.length !== 0) ?
          getRoom.map((getRoom: roomType) => (
            <div key={getRoom.id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1 sm:gap-2">
            <Button className='my-0 grid min-h-12 min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-xl bg-dark-1 p-2 text-left hover:bg-dark-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto]' onClick={() => handleRouteToRoom(getRoom.id)}>
                <div className="min-w-0 px-1 text-left">
                  <h2 className="truncate text-sm font-semibold">{getRoom?.name}</h2>
                  <p className="mt-1 truncate text-xs text-slate-400 sm:hidden">{getRoom?.inviteCode}</p>
                </div>
                <div className="hidden min-w-0 items-center text-left sm:flex">
                  <span className="truncate text-xs text-slate-400 lg:text-sm">{getRoom?.inviteCode}</span>
                </div>
                <div className="flex items-center justify-end gap-2 px-1 text-xs sm:text-sm">
                  {(getRoom.admin === user?.id) ? (
                    <h1>Admin</h1>
                  ):
                    <h1>Member</h1>
                  }
                </div>
            </Button>
            <div className="flex items-center justify-center">
            {(getRoom.admin === user?.id) ?
              <DropdownMenu>
                <DropdownMenuTrigger aria-label={`Settings for ${getRoom.name}`} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl text-slate-300 hover:bg-dark-4 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"><Settings size={19} /></DropdownMenuTrigger>
                <DropdownMenuContent className='max-w-[calc(100vw-2rem)] border-white/10 bg-dark-1 text-base text-white sm:text-lg'>
                  <DropdownMenuLabel>Room Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className='flex flex-col items-start justify-center'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='grid w-full grid-cols-[auto_1fr] justify-start gap-2 rounded-md text-sm hover:bg-dark-4'><Trash2 /><p>Delete</p></Button>
                      </DialogTrigger>
                      <DialogContent className='text-white bg-transparent border-lg rounded-lg'>
                          <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            <Button className='mt-4 min-h-11 items-center border-2 bg-red-600 font-semibold hover:bg-red-700' onClick={()=>handleDelete(getRoom.id)}>Yes, Delete this room</Button>
                          </DialogDescription>
                          </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='grid w-full grid-cols-[auto_1fr] justify-start gap-2 rounded-md text-sm hover:bg-dark-4'><Pencil /><p>Edit</p></Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-[calc(100vw-2rem)] border-white/10 bg-dark-2 text-white sm:max-w-lg'>
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
          <div className="flex min-h-32 items-center justify-center px-4 text-center text-sm text-slate-400">You are not a member of any room yet.</div>
        }
        
      </div>
    </div>
  )
}

export default MyRooms
