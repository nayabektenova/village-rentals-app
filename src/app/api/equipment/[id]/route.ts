import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()
export async function PUT(request: Request) {
  const url = new URL(request.url)
  const id = parseInt(url.pathname.split('/').pop() || '0')
  const data = await request.json()
  const updated = await prisma.equipment.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      dailyCost: data.dailyCost,
    },
  })

  return NextResponse.json(updated)
}
export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const id = parseInt(url.pathname.split('/').pop() || '0')
  const reason = request.headers.get('x-remove-reason')
  if (!reason || (reason !== 'working' && reason !== 'damaged')) {
    return NextResponse.json({ error: 'Invalid removal reason.' }, { status: 400 })
  }
  const item = await prisma.equipment.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: 'Equipment not found.' }, { status: 404 })
  if (reason === 'working') {
    await prisma.soldEquipment.create({
      data: {
        name: item.name,
        category: item.category,
        description: item.description,
        dailyCost: item.dailyCost,
      },
    })
  } else {
    await prisma.damagedEquipment.create({
      data: {
        name: item.name,
        category: item.category,
        description: item.description,
        dailyCost: item.dailyCost,
      },
    })
  }
  await prisma.equipment.delete({ where: { id } })
  return NextResponse.json({ success: true, removedId: id, reason })
}
