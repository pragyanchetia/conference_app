'use server';

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const currentProfile = async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const email = session?.user?.email?.trim().toLowerCase();

  if (!userId && !email) return null;

  if (userId) {
    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, userId: true, name: true, username: true, email: true, image: true, createdAt: true, updatedAt: true } });
    if (user) return user;
  }

  if (email) return db.user.findUnique({ where: { email }, select: { id: true, userId: true, name: true, username: true, email: true, image: true, createdAt: true, updatedAt: true } });
  return null;
};
