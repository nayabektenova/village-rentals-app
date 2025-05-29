import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PUT(request: Request) {
  const url = new URL(request.url)
  const id = parseInt(url.pathname.split('/').pop() || '0')
  const data = await request.json()
  const updatedRental = await prisma.rental.update({
    where: { id },
    data: {
      customerId: data.customerId,
      equipmentId: data.equipmentId,
      date: new Date(data.date),
      rentalDate: new Date(data.rentalDate),
      returnDate: new Date(data.returnDate),
      totalCost: data.totalCost,
    },
  })
  return NextResponse.json(updatedRental)
}
