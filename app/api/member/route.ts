import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const unauthorized = () => NextResponse.json({ message: "Please log in first." }, { status: 401 });
const forbidden = () => NextResponse.json({ message: "Only this room's admin can manage members." }, { status: 403 });

async function getMemberRoom(roomId: string, userId: string) {
  return db.room.findFirst({
    where: { id: roomId, user: { some: { id: userId } } },
    select: { id: true, admin: true },
  });
}

export async function GET(request: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) return unauthorized();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Room ID is required." }, { status: 400 });

    const room = await getMemberRoom(id, profile.id);
    if (!room) return NextResponse.json({ message: "Room not found." }, { status: 404 });

    const members = await db.user.findMany({
      where: { room: { some: { id } } },
      select: { id: true, name: true, username: true, image: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ members, adminId: room.admin });
  } catch (error) {
    console.error("[MEMBER_GET]", error);
    return NextResponse.json({ message: "Could not load room members." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) return unauthorized();
    const body = await request.json();
    const roomId = typeof body.id === "string" ? body.id : "";
    const userId = typeof body.userId === "string" ? body.userId : "";
    if (!roomId || !userId) return NextResponse.json({ message: "Room ID and member ID are required." }, { status: 400 });

    const room = await getMemberRoom(roomId, profile.id);
    if (!room) return NextResponse.json({ message: "Room not found." }, { status: 404 });
    if (room.admin !== profile.id) return forbidden();
    if (room.admin === userId) return NextResponse.json({ message: "Transfer admin access before removing this member." }, { status: 400 });

    const target = await getMemberRoom(roomId, userId);
    if (!target) return NextResponse.json({ message: "Member not found in this room." }, { status: 404 });
    await db.room.update({ where: { id: roomId }, data: { user: { disconnect: { id: userId } } } });
    return NextResponse.json({ message: "Member removed." });
  } catch (error) {
    console.error("[MEMBER_DELETE]", error);
    return NextResponse.json({ message: "Could not remove this member." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) return unauthorized();
    const body = await request.json();
    const roomId = typeof body.id === "string" ? body.id : "";
    const userId = typeof body.userId === "string" ? body.userId : "";
    if (!roomId || !userId) return NextResponse.json({ message: "Room ID and member ID are required." }, { status: 400 });

    const room = await getMemberRoom(roomId, profile.id);
    if (!room) return NextResponse.json({ message: "Room not found." }, { status: 404 });
    if (room.admin !== profile.id) return forbidden();
    if (!(await getMemberRoom(roomId, userId))) {
      return NextResponse.json({ message: "The new admin must be a member of this room." }, { status: 400 });
    }

    await db.room.update({ where: { id: roomId }, data: { admin: userId } });
    return NextResponse.json({ message: "Room admin updated." });
  } catch (error) {
    console.error("[MEMBER_PUT]", error);
    return NextResponse.json({ message: "Could not update the room admin." }, { status: 500 });
  }
}
