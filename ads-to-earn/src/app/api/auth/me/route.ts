import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCookie } from 'cookies-next';

export const runtime = 'nodejs';



export async function GET(req: NextRequest) {
  try {
    const sessionToken = getCookie('session', { req });
    if (!sessionToken || typeof sessionToken !== 'string') {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Pas connecté' } }, { status: 401 });
    }

    const session = await prisma.session.findUnique({ where: { id: sessionToken }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Session expirée' } }, { status: 401 });
    }

    const user = session.user;
    return NextResponse.json({ id: user.id, email: user.email, username: user.username, points: user.points });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Erreur serveur' } }, { status: 500 });
  }
}
