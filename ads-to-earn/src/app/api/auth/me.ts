import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sessionMiddleware } from "@/middleware";

export async function GET(req: NextRequest) {
  const mw = await sessionMiddleware(req);
  if (mw.status !== 200) return mw;

  const userId = (req as any).userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return NextResponse.json({ id: user?.id, email: user?.email, username: user?.username, points: user?.points });
}
