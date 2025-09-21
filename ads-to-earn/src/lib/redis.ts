// src/lib/redis.ts
import Redis from "ioredis";

const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const client = (global as any).__redis || new Redis(url);
if (process.env.NODE_ENV === "development") (global as any).__redis = client;

export default client;

export async function tryAddNonce(key: string, nonce: string, ttlSeconds = 30) {
  const full = `nonce:${key}:${nonce}`;
  const added = await client.set(full, "1", "NX", "EX", ttlSeconds);
  return added === "OK";
}

/**
 * Store an issued challenge nonce (issued, not yet used).
 * We'll store with TTL (e.g., 60s).
 */
export async function storeIssuedNonce(key: string, nonce: string, ttlSeconds = 60) {
  const full = `issued:${key}:${nonce}`;
  // set without NX, we want to mark issued; return true if ok
  await client.set(full, "1", "EX", ttlSeconds);
  return true;
}

/**
 * Try to consume a previously issued nonce.
 * Returns true if it exists and was removed (i.e., first use).
 * Returns false if not present (not issued or already consumed).
 */
export async function tryUseNonce(key: string, nonce: string) {
  const full = `issued:${key}:${nonce}`;
  // Use GETDEL if supported, otherwise transaction: get then del
  // ioredis supports GETDEL in newer servers; fallback:
  try {
    // @ts-ignore
    const got = await (client as any).getdel(full);
    if (got) return true;
  } catch {
    const val = await client.get(full);
    if (!val) return false;
    await client.del(full);
    return true;
  }
  return false;
}

/**
 * token-bucket helper kept (from earlier)
 */
export async function tokenBucket(key: string, capacity: number, windowSeconds: number) {
  const redisKey = `tb:${key}`;
  const cur = await client.incr(redisKey);
  if (cur === 1) await client.expire(redisKey, windowSeconds);
  const ttl = await client.ttl(redisKey);
  return {
    allowed: cur <= capacity,
    remaining: Math.max(capacity - cur, 0),
    reset: ttl,
  };
}
