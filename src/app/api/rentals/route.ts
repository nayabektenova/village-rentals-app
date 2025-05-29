import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const rentals = await prisma.rental.findMany()
  return NextResponse.json(rentals)
}
export async function POST(req: Request) {
  const data = await req.json()
  const newRental = await prisma.rental.create({
    data: {
      customerId: data.customerId,
      equipmentId: data.equipmentId,
      date: new Date(data.date),
      rentalDate: new Date(data.rentalDate),
      returnDate: new Date(data.returnDate),
      totalCost: data.totalCost,
    },
  })
  return NextResponse.json(newRental)
}
