import prisma from "./lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function sessionMiddleware(req: NextRequest) {
  const cookie = req.cookies.get("session")?.value;
  if (!cookie) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const session = await prisma.session.findUnique({
    where: { id: cookie },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });
  }

  // Inject userId in request
  (req as any).userId = session.userId;
  return NextResponse.next();
}
