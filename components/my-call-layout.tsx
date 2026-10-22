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
            <p>Click &quot;Join&quot; to enter the meeting.</p>
        </div>
    )
};