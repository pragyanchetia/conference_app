/* eslint-disable camelcase */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import DatePicker from 'react-datepicker';
import HomeCard from './home-card';
import MeetingModal from './meeting-modal';
import { useToast } from './ui/use-toast';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import Loader from './Loader';
import MemberCore from './member-core';
import { roomType } from './data-for-lists/data-list';
import { currentRoom } from '@/lib/current-room';
import useUser from '@/hooks/useUser';

type MeetingState = 'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined;

const MeetingTypeList = () => {
  const params = useParams();
  const roomId = Array.isArray(params.id) ? params.id[0] : String(params.id ?? '');
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const videoClient = useStreamVideoClient();
  const [room, setRoom] = useState<roomType | null>(null);
  const [meetingState, setMeetingState] = useState<MeetingState>();
  const [callDetails, setCallDetails] = useState<Call>();
  const [values, setValues] = useState({ dateTime: new Date(), description: '', link: '' });
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const getRoom = async () => {
      try {
        const roomData = await currentRoom(roomId);
        if (!cancelled) setRoom(roomData as roomType | null);
      } catch (error) {
        console.error('Could not load room:', error);
      } finally {
        if (!cancelled) setIsLoadingRoom(false);
      }
    };
    if (roomId) void getRoom();
    return () => { cancelled = true; };
  }, [roomId]);

  const meetingLink = callDetails && typeof window !== 'undefined'
    ? `${window.location.origin}/room/${roomId}/meeting/${callDetails.id}`
    : '';

  const createMeeting = async (instant = false) => {
    if (!user?.id) {
      toast({ title: 'Please log in to create a meeting.' });
      return;
    }
    if (!videoClient) {
      toast({ title: 'Video service is still connecting. Try again in a moment.' });
      return;
    }
    if (!instant && values.dateTime.getTime() < Date.now() - 60_000) {
      toast({ title: 'Choose a time in the future.' });
      return;
    }

    setIsCreating(true);
    try {
      const id = crypto.randomUUID();
      const call = videoClient.call('default', id);
      await call.getOrCreate({
        data: {
          starts_at: (instant ? new Date() : values.dateTime).toISOString(),
          custom: {
            description: values.description.trim() || (instant ? 'Instant Meeting' : 'Scheduled Meeting'),
            roomId,
          },
        },
      });
      setCallDetails(call);
      if (instant) {
        router.push(`/room/${roomId}/meeting/${call.id}`);
      } else {
        toast({ title: 'Meeting created.' });
      }
    } catch (error) {
      console.error('Could not create meeting:', error);
      toast({ title: 'Failed to create the meeting. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  const joinMeeting = () => {
    const value = values.link.trim();
    if (!value) {
      toast({ title: 'Paste a meeting link first.' });
      return;
    }
    try {
      const url = new URL(value, window.location.origin);
      const match = url.pathname.match(/^\/room\/([^/]+)\/meeting\/([^/]+)\/?$/);
      if (url.origin !== window.location.origin || !match) {
        toast({ title: 'That does not look like a valid Confo meeting link.' });
        return;
      }
      router.push(url.pathname);
    } catch {
      toast({ title: 'Please enter a valid meeting link.' });
    }
  };

  const now = new Date();
  if (isLoadingRoom || !user) return <Loader />;
  if (!room) return <p className="rounded-xl bg-dark-2 p-6 text-white">You are not a member of this room, or the room no longer exists.</p>;

  return (
    <>
      <div className="grid min-h-[300px] grid-cols-1 gap-5 rounded-[20px] bg-hero bg-cover p-5 md:grid-cols-[1.2fr_.8fr] lg:p-8">
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <p className="inline-flex rounded-lg bg-black/25 px-3 py-2 text-sm">Room: {room.name}</p>
            <p className="inline-flex rounded-lg bg-black/25 px-3 py-2 text-sm">Welcome, {user.name || user.username || 'member'}</p>
            <p className="break-all rounded-lg bg-black/25 px-3 py-2 text-sm">Invite code: <span className="text-emerald-300">{room.inviteCode}</span></p>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold lg:text-6xl">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</h1>
            <p className="mt-1 text-lg text-sky-100">{new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now)}</p>
          </div>
        </div>
        <div className="max-h-[360px] overflow-auto rounded-[14px] bg-dark-3/90 pt-2"><MemberCore /></div>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 xl:grid-cols-4">
        <HomeCard img="/icons/add-meeting.svg" title="New Meeting" description="Start an instant meeting" handleClick={() => void createMeeting(true)} />
        <HomeCard img="/icons/join-meeting.svg" title="Join Meeting" description="Open a meeting link" className="bg-blue-1" handleClick={() => setMeetingState('isJoiningMeeting')} />
        <HomeCard img="/icons/schedule.svg" title="Schedule Meeting" description="Pick a date and time" handleClick={() => { setCallDetails(undefined); setMeetingState('isScheduleMeeting'); }} />
      </section>

      {!callDetails ? (
        <MeetingModal isOpen={meetingState === 'isScheduleMeeting'} onClose={() => setMeetingState(undefined)} title="Schedule a meeting" buttonText={isCreating ? 'Creating...' : 'Create meeting'} handleClick={() => void createMeeting(false)}>
          <div className="flex flex-col gap-3">
            <label className="text-sm text-slate-200">Meeting description</label>
            <Textarea value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} placeholder="What is this meeting about?" maxLength={180} className="border-none bg-dark-3 focus-visible:ring-0" />
            <label className="text-sm text-slate-200">Date and time</label>
            <DatePicker selected={values.dateTime} onChange={(date: Date | null) => { if (date) setValues({ ...values, dateTime: date }); }} showTimeSelect timeFormat="HH:mm" timeIntervals={15} timeCaption="time" dateFormat="MMMM d, yyyy h:mm aa" minDate={new Date()} className="w-full rounded bg-dark-3 p-2 text-white focus:outline-none" />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal isOpen={meetingState === 'isScheduleMeeting'} onClose={() => { setMeetingState(undefined); setCallDetails(undefined); }} title="Meeting created" className="text-center" handleClick={() => { void navigator.clipboard.writeText(meetingLink); toast({ title: 'Meeting link copied.' }); }} image="/icons/checked.svg" buttonIcon="/icons/copy.svg" buttonText="Copy meeting link" />
      )}

      <MeetingModal isOpen={meetingState === 'isJoiningMeeting'} onClose={() => setMeetingState(undefined)} title="Join a meeting" className="text-center" buttonText="Join meeting" handleClick={joinMeeting}>
        <Input value={values.link} onChange={(event) => setValues({ ...values, link: event.target.value })} placeholder="Paste your Confo meeting link" className="border-none bg-dark-3 focus-visible:ring-0" />
      </MeetingModal>
    </>
  );
};

export default MeetingTypeList;
