import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ trackingCode: string }> }
) {
  const { trackingCode } = await params

  const suggestion = await prisma.suggestion.findUnique({
    where: { trackingCode },
    select: {
      category: true,
      title: true,
      status: true,
      isPublic: true,
      adminReply: true,
      createdAt: true,
    },
  })

  if (!suggestion) {
    return NextResponse.json({ error: '해당 건의를 찾을 수 없습니다.' }, { status: 404 })
  }

  // 비공개 답변은 추적 조회 시에도 노출
  return NextResponse.json(suggestion)
}
