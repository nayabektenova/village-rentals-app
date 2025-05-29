import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const equipment = await prisma.equipment.findMany();
  return NextResponse.json(equipment);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newItem = await prisma.equipment.create({
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      dailyCost: parseFloat(data.dailyCost),
    },
  });
  return NextResponse.json(newItem);
}
