import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("session")?.value;
  if (cookie) await logout(cookie);

  const res = NextResponse.json({ success: true });
  res.cookies.delete({ name: "session", path: "/" });
  return res;
}
