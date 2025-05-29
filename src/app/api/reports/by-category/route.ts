import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const grouped = await prisma.equipment.groupBy({
    by: ['category'],
    _count: { category: true },
  })

  const formatted = grouped.map(g => ({
    category: g.category,
    itemCount: g._count.category,
  }))

  return NextResponse.json(formatted)
}
