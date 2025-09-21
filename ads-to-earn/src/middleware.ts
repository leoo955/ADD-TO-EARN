import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get('session')?.value

  if (!cookie) {
    // Pas de session -> continuer ou bloquer certaines routes
    return NextResponse.next()
  }

  // Vérifie la session en DB
  const session = await prisma.session.findUnique({
    where: { id: cookie }
  })

  if (!session || session.expiresAt < new Date()) {
    // Session invalide ou expirée
    const res = NextResponse.next()
    res.cookies.set('session', '', { maxAge: 0 }) // efface cookie
    return res
  }

  // Ajoute userId au header pour les API downstream si nécessaire
  const res = NextResponse.next()
  res.headers.set('x-user-id', session.userId)
  return res
}

// Routes où le middleware doit s’appliquer
export const config = {
  matcher: ['/api/:path*']  // Applique sur toutes les APIs
}
