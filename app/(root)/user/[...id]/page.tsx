'use client'

import CreateRoomForm from "@/components/forms/create-room-form";
import JoinRoomForm from "@/components/forms/join-room-form";
import MyRooms from "@/components/my-rooms"; 


const UserHome = () => { 
    
  return (
    <div className="relative mx-auto w-full max-w-7xl">
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 text-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:gap-6">
        <div className="grid min-w-0 content-start gap-4">
          <CreateRoomForm />
          <JoinRoomForm />
        </div>

        <div className="min-w-0">
          <MyRooms />
        </div>
      </div>
    </div>
  );
}

export default UserHome
