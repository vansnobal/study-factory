import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Category, Status } from '@prisma/client'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') as Status | null
  const category = searchParams.get('category') as Category | null
  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 20)

  const where = {
    ...(status && { status }),
    ...(category && { category }),
  }

  const [data, total] = await Promise.all([
    prisma.suggestion.findMany({
      where,
      select: {
        id: true,
        category: true,
        title: true,
        status: true,
        isPublic: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.suggestion.count({ where }),
  ])

  return NextResponse.json({ data, total, page, limit })
}
