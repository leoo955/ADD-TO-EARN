export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'argon2';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: { code: 'INVALID_INPUT', message: 'Email et mot de passe requis' } }, { status: 400 });
    }

    const hashedPassword = await hash(password);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });

    return NextResponse.json({ userId: user.id }, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: { code: 'EMAIL_TAKEN', message: 'Email déjà utilisé' } }, { status: 409 });
    }
    return NextResponse.json({ error: { code: 'UNKNOWN', message: 'Erreur serveur' } }, { status: 500 });
  }
}
