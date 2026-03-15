import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Status } from '@prisma/client'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { id } = await params

  const suggestion = await prisma.suggestion.findUnique({ where: { id } })
  if (!suggestion) {
    return NextResponse.json({ error: '건의를 찾을 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.json(suggestion)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { status, adminReply, isPublic } = body

  const validStatuses = Object.values(Status)
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: '유효하지 않은 상태값입니다.' }, { status: 400 })
  }

  const updated = await prisma.suggestion.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(adminReply !== undefined && {
        adminReply,
        repliedAt: adminReply ? new Date() : null,
      }),
      ...(isPublic !== undefined && { isPublic }),
    },
  })

  return NextResponse.json(updated)
}
