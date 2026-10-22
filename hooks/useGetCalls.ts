'use client';

import { Call, CallRecording, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useUser from "./useUser";

type CallListType = 'ended' | 'upcoming' | 'recordings';

export const useGetCalls = (type: CallListType) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [callRecordings, setCallRecordings] = useState<CallRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = useStreamVideoClient();
  const { user } = useUser();
  const params = useParams();
  const roomId = Array.isArray(params.id) ? params.id[0] : String(params.id ?? "");

  useEffect(() => {
    let cancelled = false;
    const loadCalls = async () => {
      if (!client || !user?.id) {
        setIsLoading(!user?.id);
        return;
      }
      setIsLoading(true);
      try {
        const result = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });
        if (cancelled) return;
        const roomCalls = result.calls.filter((call) => {
          const custom = call.state.custom as { roomId?: string } | undefined;
          return custom?.roomId === roomId;
        });
        setCalls(roomCalls);

        if (type === 'recordings') {
          const recordingResults = await Promise.all(roomCalls.map(async (call) => {
            try {
              const response = await call.queryRecordings();
              return response.recordings || [];
            } catch {
              return [];
            }
          }));
          if (!cancelled) setCallRecordings(recordingResults.flat());
        } else if (!cancelled) {
          setCallRecordings([]);
        }
      } catch (error) {
        console.error("Could not load calls:", error);
        if (!cancelled) {
          setCalls([]);
          setCallRecordings([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadCalls();
    return () => { cancelled = true; };
  }, [client, user?.id, roomId, type]);

  const now = Date.now();
  const getStartTime = (call: Call) => {
    const startsAt = call.state.startsAt;
    if (!startsAt) return undefined;
    return startsAt instanceof Date ? startsAt.getTime() : new Date(startsAt).getTime();
  };
  const endedCalls = calls.filter((call) => Boolean(call.state.endedAt) || Boolean(getStartTime(call) && getStartTime(call)! < now));
  const upcomingCalls = calls.filter((call) => Boolean(getStartTime(call) && getStartTime(call)! >= now && !call.state.endedAt));

  return { endedCalls, upcomingCalls, callRecordings, isLoading };
};
