'use client'

import { useState } from 'react'
import Link from 'next/link'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  RECEIVED:  { label: '접수', color: 'bg-blue-100 text-blue-700' },
  REVIEWING: { label: '검토중', color: 'bg-yellow-100 text-yellow-700' },
  COMPLETED: { label: '완료', color: 'bg-green-100 text-green-700' },
  PENDING:   { label: '보류', color: 'bg-gray-100 text-gray-600' },
}

const CATEGORY_MAP: Record<string, string> = {
  WELFARE: '복지',
  WORK_ENV: '업무환경',
  CULTURE: '조직문화',
  OTHER: '기타',
}

type SuggestionResult = {
  category: string
  title: string
  status: string
  isPublic: boolean
  adminReply: string | null
  createdAt: string
}

export default function TrackPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<SuggestionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/suggestions/${code.trim()}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '조회에 실패했습니다.')
        return
      }
      setResult(data)
    } catch {
      setError('서버 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← 건의 제출로 돌아가기</Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">건의 상태 확인</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                추적 코드
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="건의 제출 후 받은 추적 코드를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '조회 중...' : '조회하기'}
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                카테고리: {CATEGORY_MAP[result.category] ?? result.category}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_MAP[result.status]?.color}`}>
                {STATUS_MAP[result.status]?.label ?? result.status}
              </span>
            </div>

            <div>
              <p className="font-medium text-gray-900">{result.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                접수일: {new Date(result.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">관리자 답변</p>
              {result.adminReply ? (
                <p className="text-sm text-gray-700 bg-blue-50 rounded-lg p-3">{result.adminReply}</p>
              ) : (
                <p className="text-sm text-gray-400">아직 답변이 없습니다.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
