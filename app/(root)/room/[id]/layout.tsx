
import { ReactNode } from "react";
import { notFound } from "next/navigation";

import { currentRoom } from "@/lib/current-room";
import StreamVideoProvider from "@/providers/stream-video-providers";

type RoomLayoutProps = Readonly<{
  children: ReactNode;
  params: {
    id: string;
  };
}>;

const RoomLayout = async ({
  children,
  params,
}: RoomLayoutProps) => {
  const room = await currentRoom(params.id);

  // Do not expose room pages to non-members.
  if (!room) {
    notFound();
  }

  return (
    <StreamVideoProvider>
      {children}
    </StreamVideoProvider>
  );
};

export default RoomLayout;
