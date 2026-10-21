'use server';

import { auth } from "@/auth";
import { db } from "@/lib/db";

// A room is only returned to someone who is already a member of it.
export const currentRoom = async (id: string) => {
  if (!id) return null;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;

  return db.room.findFirst({
    where: { id, user: { some: { id: userId } } },
  });
};
