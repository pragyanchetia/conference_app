'use client'

import CreateRoomForm from "@/components/forms/create-room-form";
import JoinRoomForm from "@/components/forms/join-room-form";
import MyRooms from "@/components/my-rooms"; 


const UserHome = () => { 
   
  return (
    <div className="relative">  
        <div className='grid grid-cols-[1fr_2fr] text-white'>
          <div className='grid xl:grid-rows-[1fr_.5fr] gap-3 mx-10'> 
              <CreateRoomForm />  
              <JoinRoomForm /> 
          </div> 
          <div className="flex-center">
            <MyRooms />
          </div>
        </div>   
    </div>
  )
}

export default UserHome
