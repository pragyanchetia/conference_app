import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);
  const videoClient = useStreamVideoClient();
  const callId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    let cancelled = false;
    if (!videoClient || !callId) {
      if (!callId) setCall(undefined);
      setIsCallLoading(Boolean(callId));
      return;
    }

    const loadCall = async () => {
      setIsCallLoading(true);
      try {
        const nextCall = videoClient.call("default", callId);
        await nextCall.get();
        if (!cancelled) setCall(nextCall);
      } catch (error) {
        console.error("Could not load meeting:", error);
        if (!cancelled) setCall(undefined);
      } finally {
        if (!cancelled) setIsCallLoading(false);
      }
    };

    loadCall();
    return () => { cancelled = true; };
  }, [videoClient, callId]);

  return { call, isCallLoading };
};
