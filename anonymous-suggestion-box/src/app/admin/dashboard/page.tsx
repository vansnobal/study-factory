'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  RECEIVED:  { label: '접수', color: 'bg-blue-100 text-blue-700' },
  REVIEWING: { label: '검토중', color: 'bg-yellow-100 text-yellow-700' },
  COMPLETED: { label: '완료', color: 'bg-green-100 text-green-700' },
  PENDING:   { label: '보류', color: 'bg-gray-100 text-gray-600' },
}

const CATEGORY_MAP: Record<string, string> = {
  WELFARE: '복지', WORK_ENV: '업무환경', CULTURE: '조직문화', OTHER: '기타',
}

type Suggestion = {
  id: string
  category: string
  title: string
  status: string
  isPublic: boolean
  createdAt: string
}

export default function AdminDashboardPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const limit = 20

  const fetchSuggestions = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (statusFilter) params.set('status', statusFilter)
    if (categoryFilter) params.set('category', categoryFilter)

    const res = await fetch(`/api/admin/suggestions?${params}`)
    if (res.ok) {
      const data = await res.json()
      setSuggestions(data.data)
      setTotal(data.total)
    }
    setLoading(false)
  }, [page, statusFilter, categoryFilter])

  useEffect(() => { fetchSuggestions() }, [fetchSuggestions])

  const totalPages = Math.ceil(total / limit)

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-gray-900">관리자 대시보드</h1>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="text-sm text-gray-500 hover:text-gray-700">
          로그아웃
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 필터 */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 상태</option>
            {Object.entries(STATUS_MAP).map(([v, { label }]) => (
              <option key={v} value={v}>{label}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 카테고리</option>
            {Object.entries(CATEGORY_MAP).map(([v, label]) => (
              <option key={v} value={v}>{label}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500 self-center">총 {total}건</span>
        </div>

        {/* 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400">불러오는 중...</div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">건의가 없습니다.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">제목</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium w-20">카테고리</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium w-20">상태</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium w-24">접수일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suggestions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/dashboard/${s.id}`} className="text-blue-600 hover:underline line-clamp-1">
                        {s.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{CATEGORY_MAP[s.category]}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_MAP[s.status]?.color}`}>
                        {STATUS_MAP[s.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(s.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40">
              이전
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40">
              다음
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
