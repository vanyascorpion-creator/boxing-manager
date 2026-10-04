import { NextResponse } from "next/server";

import { startSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const login: string = (body?.login ?? "").toString().trim();
  const password: string = (body?.password ?? "").toString();

  if (!login || !password) {
    return NextResponse.json(
      { error: "Нужно ввести логин и пароль" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { login } });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Неверный логин или пароль" },
      { status: 401 }
    );
  }

  await startSession(user.id);

  return NextResponse.json({ id: user.id, login: user.login });
}
