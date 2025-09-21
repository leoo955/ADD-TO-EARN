import { prisma } from '@/lib/prisma';
import { randomUUID } from "crypto";
import argon2 from "argon2";

export async function register(email: string, password: string, username?: string) {
  const hashed = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, username },
  });

  const session = await prisma.session.create({
    data: { userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });

  return { userId: user.id, sessionId: session.id };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await argon2.verify(user.password, password);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  const session = await prisma.session.create({
    data: { userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });

  return { userId: user.id, sessionId: session.id };
}

export async function logout(sessionId: string) {
  await prisma.session.delete({ where: { id: sessionId } });
}
