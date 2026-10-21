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
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <div className="h-[300px] max-w-[400px] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Setup</h1>
        <VideoPreview />
      </div>
      <div className="h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
            <input 
            type="checkbox" 
            checked={isMicCamToggleOn}
            onChange={(e)=> setIsMicCamToggleOn(e.target.checked)}
            />
            Join with mic and camera off
        </label>
        {/* <DeviceSettings /> */}
      </div>
      <Button className="rounded-md bg-green-500 px-4 py-5" disabled={isJoining} onClick={async () => {
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
        {isJoining ? 'JOINING...' : 'JOIN MEETING'}
      </Button>
    </div>
  )
}

export default MeetingSetup
