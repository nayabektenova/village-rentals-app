import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const categories = await prisma.category.findMany()
  return NextResponse.json(categories)
}
export async function POST(req: Request) {
  const data = await req.json()
  const category = await prisma.category.create({
    data: {
      id: data.id,
      description: data.description,
    },
  })
  return NextResponse.json(category)
}
