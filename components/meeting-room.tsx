'use client';

import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList, 
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
 
import { Users, LayoutList } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import Loader from './Loader';
import EndCallButton from './end-call-button';
import { cn } from '@/lib/utils'; 
import { useRouter } from 'next/navigation'; 
type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

export interface MeetingProps { 
  link: string;
  onleave: boolean, 
  setOnLeave: (onleave: boolean) => void;
}

const MeetingRoom = ({ link, onleave, setOnLeave}: MeetingProps) => {
  
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');

  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks(); 
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;
  
  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };
    
  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white"> 
      
      {/* call layout and view participants: */}
      <div className="relative flex flex-col size-full items-center justify-center">
      <h1 className='text-2xl font-semibold text-sky-50'>Meeting Link: <span className='text-sky-500'>{link}</span></h1>
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">

        <CallControls onLeave={()=> setOnLeave(!onleave)}/>

        {/* Dropdown for Layout Options */}
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        
        <EndCallButton onleave={onleave} setOnLeave={setOnLeave}/>
      </div>
    </section>
  );
};

export default MeetingRoom;