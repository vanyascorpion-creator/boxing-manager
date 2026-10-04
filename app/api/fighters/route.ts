import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const fighters = await prisma.fighter.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(fighters);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = await request.json();


  const fighter = await prisma.fighter.create({
    data: {
      name: body.name,
      age: Number(body.age),
      height: Number(body.height),
      weight: Number(body.weight),
    },
  });

  return NextResponse.json(fighter, { status: 201 });
}