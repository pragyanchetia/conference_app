import { Prisma } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const unauthorized = () => NextResponse.json({ message: "Please log in first." }, { status: 401 });
const forbidden = () => NextResponse.json({ message: "You do not have permission to do that." }, { status: 403 });

async function isRoomAdmin(roomId: string, userId: string) {
  const room = await db.room.findFirst({
    where: { id: roomId, user: { some: { id: userId } } },
    select: { id: true, admin: true },
  });
  return room?.admin === userId ? room : null;
}

export async function GET() {
  try {
    const profile = await currentProfile();
    if (!profile) return unauthorized();

    const rooms = await db.room.findMany({
      where: { user: { some: { id: profile.id } } },
      select: {
        id: true, name: true, description: true, inviteCode: true, admin: true,
        user: { select: { id: true }, where: { id: profile.id } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("[ROOM_GET]", error);
    return NextResponse.json({ message: "Could not load rooms." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) return unauthorized();

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (!name || name.length > 80) {
      return NextResponse.json({ message: "Room name is required and must be under 80 characters." }, { status: 400 });
    }
    if (description.length > 2000) {
      return NextResponse.json({ message: "Room description is too long." }, { status: 400 });
    }

    const room = await db.room.create({
      data: {
        name,
        description,
        inviteCode: crypto.randomUUID(),
        admin: profile.id,
        user: { connect: { id: profile.id } },
      },
    });
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("[ROOM_POST]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "A room with that name already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Could not create room." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) return unauthorized();

    const updateType = new URL(request.url).searchParams.get("update");
    const body = await request.json();

    if (updateType === "join-room") {
      const inviteCode = typeof body.InviteCode === "string" ? body.InviteCode.trim() : "";
      if (!inviteCode) return NextResponse.json({ message: "Invite code is required." }, { status: 400 });
      const room = await db.room.findUnique({ where: { inviteCode } });
      if (!room) return NextResponse.json({ message: "That invite code was not found." }, { status: 404 });

      const alreadyMember = await db.room.findFirst({
        where: { id: room.id, user: { some: { id: profile.id } } },
      });
      if (alreadyMember) return NextResponse.json(alreadyMember);

      const joined = await db.room.update({
        where: { id: room.id },
        data: { user: { connect: { id: profile.id } } },
      });
      return NextResponse.json(joined);
    }

    if (updateType === "update-details") {
      const id = typeof body.id === "string" ? body.id : "";
      const name = typeof body.Name === "string" ? body.Name.trim() : "";
      const description = typeof body.Description === "string" ? body.Description.trim() : "";
      if (!id || !name) return NextResponse.json({ message: "Room ID and name are required." }, { status: 400 });
      if (name.length > 80 || description.length > 2000) return NextResponse.json({ message: "Room details are too long." }, { status: 400 });
      if (!(await isRoomAdmin(id, profile.id))) return forbidden();

      const room = await db.room.update({ where: { id }, data: { name, description } });
      return NextResponse.json(room);
    }

    return NextResponse.json({ message: "Invalid update type." }, { status: 400 });
  } catch (error) {
    console.error("[ROOM_PUT]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "A room with that name already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Could not update the room." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) return unauthorized();
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return NextResponse.json({ message: "Room ID is required." }, { status: 400 });
    if (!(await isRoomAdmin(id, profile.id))) return forbidden();

    await db.room.delete({ where: { id } });
    return NextResponse.json({ message: "Room deleted successfully." });
  } catch (error) {
    console.error("[ROOM_DELETE]", error);
    return NextResponse.json({ message: "Could not delete the room." }, { status: 500 });
  }
}
