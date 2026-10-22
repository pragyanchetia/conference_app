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
import { Check, Copy, LayoutGrid, LayoutList, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './end-call-button';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

export interface MeetingProps {
  link: string;
  onleave: boolean;
  setOnLeave: (onleave: boolean) => void;
}

const MeetingRoom = ({ link, onleave, setOnLeave }: MeetingProps) => {
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [copied, setCopied] = useState(false);
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Could not copy meeting link:', error);
    }
  };

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
    <main className="meeting-shell flex min-h-0 w-full flex-col overflow-hidden text-white">
      <header className="meeting-header mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 pb-3 pt-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Live meeting
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">
            Your meeting room
          </h1>
          <p className="mt-1 max-w-full break-all text-sm text-slate-400">
            {link}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start lg:self-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            <Users size={16} aria-hidden="true" />
            {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
          </span>
          <button
            type="button"
            onClick={copyMeetingLink}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm font-semibold transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label="Copy meeting link"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied' : 'Copy link'}</span>
          </button>
        </div>
      </header>

      <div className="meeting-workspace mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 gap-4 px-2 pb-2 sm:px-4 lg:px-6">
        <section className="meeting-video-surface relative flex min-h-[240px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#10131d] p-1 sm:p-3">
          <div className="h-full min-h-0 w-full min-w-0">
            <CallLayout />
          </div>
        </section>

        {showParticipants && (
          <aside className="meeting-participants-panel absolute inset-x-2 bottom-24 z-30 max-h-[55vh] overflow-auto rounded-2xl border border-white/10 bg-[#1c1f2e] p-2 shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-4 sm:w-80 lg:relative lg:inset-auto lg:max-h-none lg:w-80 lg:shrink-0">
            <div className="mb-2 flex items-center justify-between px-2 pt-1">
              <h2 className="text-sm font-semibold">Participants</h2>
              <button
                type="button"
                onClick={() => setShowParticipants(false)}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Close
              </button>
            </div>
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </aside>
        )}
      </div>

      <footer className="meeting-controls-wrap sticky bottom-0 z-20 flex w-full flex-wrap items-center justify-center gap-2 border-t border-white/10 bg-[#171a25]/95 px-2 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(0,0,0,0.2)] backdrop-blur sm:gap-3 sm:px-4">
        <CallControls onLeave={() => setOnLeave(!onleave)} />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#252a3b] px-3 text-white transition hover:bg-[#343b51] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label="Change meeting layout"
          >
            {layout === 'grid' ? <LayoutGrid size={19} /> : <LayoutList size={19} />}
            <span className="hidden text-sm sm:inline">Layout</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-white/10 bg-dark-1 text-white">
            {([
              ['grid', 'Grid view'],
              ['speaker-left', 'Speaker left'],
              ['speaker-right', 'Speaker right'],
            ] as const).map(([value, label]) => (
              <div key={value}>
                <DropdownMenuItem
                  onClick={() => setLayout(value)}
                  className="cursor-pointer focus:bg-dark-4 focus:text-white"
                >
                  {label}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-white/10" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => setShowParticipants((previous) => !previous)}
          aria-pressed={showParticipants}
          aria-label={showParticipants ? 'Hide participants' : 'Show participants'}
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#252a3b] px-3 text-white transition hover:bg-[#343b51] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <Users size={19} />
          <span className="hidden text-sm sm:inline">People</span>
        </button>

        <EndCallButton onleave={onleave} setOnLeave={setOnLeave} />
      </footer>
    </main>
  );
};

export default MeetingRoom;