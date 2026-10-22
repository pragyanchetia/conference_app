import { CallingState, useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

export const MyUILayout = () => {
    const call = useCall();

    const { useCallCallingState, useParticipantCount } = useCallStateHooks();

    const callingState = useCallCallingState();
    const participantCount = useParticipantCount(); 

    if (callingState !== CallingState.JOINED) {
        return <div>Loading...</div>
    }

    return (
        <div>
            Call &quot;{call?.id}&quot; has {participantCount} participants
        </div>
    )
};