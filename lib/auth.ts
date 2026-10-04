import {
  createHash,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

const scrypt = promisify(nodeScrypt);

export const SESSION_COOKIE = "boxing_session";

/** Срок жизни сессии: 7 дней. */
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const KEY_LENGTH = 64;

export type CurrentUser = {
  id: number;
  login: string;
};

/*
 * PASSWORDS
 */

async function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);

  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [algorithm, saltHex, keyHex] = stored.split("$");

  if (algorithm !== "scrypt" || !saltHex || !keyHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(keyHex, "hex");
  const actual = await deriveKey(password, salt);

  return (
    expected.length === actual.length && timingSafeEqual(expected, actual)
  );
}

/*
 * SESSIONS
 *
 * В браузере хранится только случайный токен. В базе лежит его sha256-хеш,
 * поэтому украденная база не даёт готовых сессий, а саму сессию можно отозвать.
 */

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + SESSION_TTL_MS),
  });
}

export async function startSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });

  await setSessionCookie(token);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return { id: session.userId, login: session.user.login };
}

export async function endCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => {});
  }

  cookieStore.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
