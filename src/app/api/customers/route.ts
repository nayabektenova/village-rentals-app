import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const customers = await prisma.customer.findMany()
  return NextResponse.json(customers)
}
export async function POST(req: Request) {
  const data = await req.json()
  const created = await prisma.customer.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      banned: data.banned || false,
    },
  })
  return NextResponse.json(created)
}
