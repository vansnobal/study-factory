import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const CATEGORY_MAP: Record<string, string> = {
  WELFARE: '복지', WORK_ENV: '업무환경', CULTURE: '조직문화', OTHER: '기타',
}

export const dynamic = 'force-dynamic'

export default async function BoardPage() {
  const suggestions = await prisma.suggestion.findMany({
    where: { isPublic: true, status: 'COMPLETED' },
    select: {
      id: true,
      category: true,
      title: true,
      adminReply: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← 건의 제출로 돌아가기</Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">공개 건의 게시판</h1>

        {suggestions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            아직 공개된 건의가 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {CATEGORY_MAP[s.category] ?? s.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(s.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="font-medium text-gray-900 mb-3">{s.title}</p>
                {s.adminReply && (
                  <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                    <p className="text-xs font-medium text-blue-600 mb-1">관리자 답변</p>
                    <p className="text-sm text-gray-700">{s.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
