'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useParams, useRouter } from 'next/navigation';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './meeting-card';
import { LoaderCircle } from 'lucide-react';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();
  const params = useParams();
  const roomId = Array.isArray(params.id) ? params.id[0] : String(params.id ?? '');

  const noCallsMessage = type === 'ended' ? 'No previous calls yet.' : type === 'recordings' ? 'No recordings available.' : 'No upcoming calls.';
  if (isLoading) return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin" /></div>;

  if (type === 'recordings') {
    return (
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {callRecordings.length ? callRecordings.map((recording) => {
          const item = recording as CallRecording & { filename?: string; start_time?: string; url?: string };
          return (
            <MeetingCard key={`${item.url || item.filename}-${item.start_time}`} icon="/icons/recordings.svg"
              title={item.filename || 'Meeting recording'}
              date={item.start_time ? new Date(item.start_time).toLocaleString() : 'Date unavailable'}
              buttonIcon1="/icons/play.svg" buttonText="Play" link={item.url || '#'}
              handleClick={() => { if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer'); }} />
          );
        }) : <p className="text-xl font-semibold text-white">{noCallsMessage}</p>}
      </div>
    );
  }

  const calls = type === 'ended' ? endedCalls : upcomingCalls;
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls.length ? calls.map((call: Call) => {
        const description = (call.state.custom as { description?: string } | undefined)?.description || 'Meeting';
        const startsAt = call.state.startsAt ? (call.state.startsAt instanceof Date ? call.state.startsAt.toLocaleString() : new Date(call.state.startsAt).toLocaleString()) : 'Date unavailable';
        const link = `/room/${roomId}/meeting/${call.id}`;
        return <MeetingCard key={call.id} icon={type === 'ended' ? '/icons/previous.svg' : '/icons/upcoming.svg'}
          title={description.slice(0, 40)} date={startsAt} isPreviousMeeting={type === 'ended'}
          buttonText={type === 'ended' ? 'View' : 'Join'} link={link} handleClick={() => router.push(link)} />;
      }) : <p className="text-xl font-semibold text-white">{noCallsMessage}</p>}
    </div>
  );
};

export default CallList;
