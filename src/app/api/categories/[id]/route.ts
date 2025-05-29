import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PUT(request: Request) {
  const url = new URL(request.url)
  const id = parseInt(url.pathname.split('/').pop() || '0')
  const data = await request.json()
  const category = await prisma.category.update({
    where: { id },
    data: { description: data.description },
  })

  return NextResponse.json(category)
}

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const id = parseInt(url.pathname.split('/').pop() || '0')
  await prisma.category.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
