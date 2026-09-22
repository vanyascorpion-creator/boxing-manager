import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const fighters = await prisma.fighter.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(fighters);
}

export async function POST(request: Request) {
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