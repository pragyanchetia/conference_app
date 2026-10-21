import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please fill in every field." }, { status: 400 });
    }
    if (name.length > 60 || email.length > 254) {
      return NextResponse.json({ message: "One of the fields is too long." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8 || password.length > 72) {
      return NextResponse.json({ message: "Password must be between 8 and 72 characters." }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    await db.user.create({ data: { name, email, password: passwordHash } });
    return NextResponse.json({ message: "Account created. You can now log in." }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Could not create your account." }, { status: 500 });
  }
}
