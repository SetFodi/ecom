// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

  return NextResponse.json({ message: "Logged out successfully" });
}