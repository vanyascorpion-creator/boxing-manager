import { NextResponse } from "next/server";

import { hashPassword, startSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const login: string = (body?.login ?? "").toString().trim();
  const password: string = (body?.password ?? "").toString();

  if (login.length < 3) {
    return NextResponse.json(
      { error: "Логин должен содержать минимум 3 символа" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Пароль должен содержать минимум 6 символов" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { login } });

  if (existing) {
    return NextResponse.json(
      { error: "Такой логин уже занят" },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      login,
      passwordHash: await hashPassword(password),
    },
  });

  await startSession(user.id);

  return NextResponse.json({ id: user.id, login: user.login }, { status: 201 });
}
