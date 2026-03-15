import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { category, title, content } = body

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'title과 content는 필수입니다.' }, { status: 400 })
  }

  const validCategories = Object.values(Category)
  if (category && !validCategories.includes(category)) {
    return NextResponse.json({ error: '유효하지 않은 카테고리입니다.' }, { status: 400 })
  }

  // 익명성 보장: IP, User-Agent 등 개인식별 정보 저장하지 않음
  const suggestion = await prisma.suggestion.create({
    data: {
      category: category ?? Category.OTHER,
      title: title.trim(),
      content: content.trim(),
    },
  })

  return NextResponse.json({ trackingCode: suggestion.trackingCode }, { status: 201 })
}
