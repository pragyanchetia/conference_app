'use client'

import { useEffect, useState } from "react";

import { VideoPreview, useCall } from "@stream-io/video-react-sdk"

import { Button } from "./ui/button";

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean)=> void }) => {

    const call = useCall();
    const [ isMicCamToggleOn, setIsMicCamToggleOn ] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    useEffect (() => {
        if (!call) return;
        if(isMicCamToggleOn) {
            call.camera.disable();
            call.microphone.disable();
        } else {
            call.camera.enable();
            call.microphone.enable();
        }

    }, [isMicCamToggleOn, call])

    if(!call) {
        throw new Error('useStreamCall must be used within StreamCall component');
    }

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-5 overflow-y-auto px-4 py-8 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#1c1f2e] p-4 shadow-2xl sm:p-6">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Before you join</p>
          <h1 className="mb-5 mt-2 text-2xl font-bold sm:text-3xl">Meeting setup</h1>
          <div className="w-full overflow-hidden rounded-2xl bg-[#10131d]">
            <VideoPreview />
          </div>
        </div>
      </section>
      <div className="flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-white/10 bg-[#1c1f2e] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <label className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-200">
            <input 
            type="checkbox" 
            checked={isMicCamToggleOn}
            onChange={(e)=> setIsMicCamToggleOn(e.target.checked)}
            className="mt-1 size-4 accent-sky-400"
            />
            <span>Join with microphone and camera off</span>
        </label>
        <Button className="min-h-12 w-full rounded-xl bg-sky-400 px-6 font-bold text-slate-950 hover:bg-sky-300 sm:w-auto" disabled={isJoining} onClick={async () => {
            setIsJoining(true);
            try {
              await call.join();
              setIsSetupComplete(true);
            } catch (error) {
              console.error('Could not join meeting:', error);
            } finally {
              setIsJoining(false);
            }
        }}>
        {isJoining ? 'Joining…' : 'Join meeting'}
      </Button>
      </div>
    </main>
  )
}

export default MeetingSetup
