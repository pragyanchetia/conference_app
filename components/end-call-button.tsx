'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

import { Button } from './ui/button';  
import { toast } from './ui/use-toast';

export interface MeetingProps { 
  onleave: boolean, 
  setOnLeave: (onleave: boolean) => void;
}

const EndCallButton = ({ onleave, setOnLeave}: MeetingProps) => {
  const call = useCall(); 

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => { 
    await call.endCall(); 
    setOnLeave(!onleave);
    toast({ title: 'Meeting Ended'})
  };

  return (
    <Button onClick={endCall} className="bg-red-500">
      End call for everyone
    </Button>
  );
};

export default EndCallButton;