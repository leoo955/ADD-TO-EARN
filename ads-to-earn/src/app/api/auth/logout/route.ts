export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCookie, deleteCookie } from 'cookies-next';



export async function POST(req: NextRequest) {
  try {
    const sessionToken = getCookie('session', { req });

    if (sessionToken && typeof sessionToken === 'string') {
      await prisma.session.deleteMany({ where: { id: sessionToken } });
    }

    const res = NextResponse.json({ success: true });
    deleteCookie('session', { req, res });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    );
  }
}
