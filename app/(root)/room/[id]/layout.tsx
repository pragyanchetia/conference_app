import { ReactNode } from 'react';
import StreamVideoProvider from '@/providers/stream-video-providers';

const RoomLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <StreamVideoProvider>{children}</StreamVideoProvider>
);

export default RoomLayout;
