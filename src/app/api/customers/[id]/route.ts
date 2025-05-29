import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PUT(request: Request) {
  const url = new URL(request.url)
  const id = parseInt(url.pathname.split('/').pop() || '0')
  const data = await request.json()
  const updated = await prisma.customer.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      banned: data.banned,
    },
  })

  return NextResponse.json(updated)
}
