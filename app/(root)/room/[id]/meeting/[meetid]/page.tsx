'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/meeting-room';
import MeetingSetup from '@/components/meeting-setup';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useGetCallById } from '@/hooks/useGetCallById';
import { currentRoom } from '@/lib/current-room';

const MeetingPage = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = Array.isArray(params.id) ? params.id[0] : String(params.id ?? '');
  const meetingId = Array.isArray(params.meetid) ? params.meetid[0] : String(params.meetid ?? '');
  const [hasRoomAccess, setHasRoomAccess] = useState<boolean | null>(null);
  const { call, isCallLoading } = useGetCallById(hasRoomAccess === true ? meetingId : "");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [hasLeft, setHasLeft] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkRoom = async () => {
      try {
        const room = await currentRoom(roomId);
        if (!cancelled) setHasRoomAccess(Boolean(room));
      } catch (error) {
        console.error('Could not check room access:', error);
        if (!cancelled) setHasRoomAccess(false);
      }
    };
    if (roomId) void checkRoom();
    return () => { cancelled = true; };
  }, [roomId]);

  useEffect(() => {
    if (hasLeft) router.push(`/room/${roomId}`);
  }, [hasLeft, roomId, router]);

  if (hasRoomAccess === null || isCallLoading) return <Loader />;
  if (!hasRoomAccess) return <Alert className="m-6 border-red-400/30 bg-dark-2 text-white"><AlertTitle>You are not a member of this room.</AlertTitle></Alert>;
  if (!call) return <p className="p-8 text-center text-xl font-semibold text-white">This meeting could not be found.</p>;
  const meetingRoomId = (call.state.custom as { roomId?: string } | undefined)?.roomId;
  if (meetingRoomId !== roomId) {
    return <Alert className="m-6 border-red-400/30 bg-dark-2 text-white"><AlertTitle>This meeting does not belong to this room.</AlertTitle></Alert>;
  }

  const link = typeof window !== 'undefined' ? window.location.href : `/room/${roomId}/meeting/${meetingId}`;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? <MeetingSetup setIsSetupComplete={setIsSetupComplete} /> : <MeetingRoom link={link} onleave={hasLeft} setOnLeave={setHasLeft} />}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
