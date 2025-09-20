import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const { userId, sessionId } = await login(email, password);
    const res = NextResponse.json({ userId });
    res.cookies.set("session", sessionId, { httpOnly: true, path: "/", maxAge: 7 * 24 * 60 * 60 });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: { code: "INVALID_CREDENTIALS", message: err.message } }, { status: 400 });
  }
}
