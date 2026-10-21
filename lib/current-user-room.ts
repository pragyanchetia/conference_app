'use server';

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const currentRooms = async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return [];

  return db.room.findMany({
    where: { user: { some: { id: userId } } },
    orderBy: { createdAt: "desc" },
  });
};
