'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const STATUS_OPTIONS = [
  { value: 'RECEIVED', label: '접수' },
  { value: 'REVIEWING', label: '검토중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'PENDING', label: '보류' },
]

const CATEGORY_MAP: Record<string, string> = {
  WELFARE: '복지', WORK_ENV: '업무환경', CULTURE: '조직문화', OTHER: '기타',
}

type Suggestion = {
  id: string
  category: string
  title: string
  content: string
  status: string
  isPublic: boolean
  adminReply: string | null
  createdAt: string
}

export default function AdminDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [status, setStatus] = useState('')
  const [reply, setReply] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/suggestions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSuggestion(data)
        setStatus(data.status)
        setReply(data.adminReply ?? '')
        setIsPublic(data.isPublic)
      })
  }, [id])

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/admin/suggestions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminReply: reply || null, isPublic }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  if (!suggestion) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">불러오는 중...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="text-sm text-blue-600 hover:underline">← 목록으로</Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
            <span>카테고리: {CATEGORY_MAP[suggestion.category]}</span>
            <span>·</span>
            <span>접수일: {new Date(suggestion.createdAt).toLocaleDateString('ko-KR')}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">{suggestion.title}</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{suggestion.content}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
          {/* 처리 상태 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">처리 상태</p>
            <div className="flex gap-3 flex-wrap">
              {STATUS_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={(e) => setStatus(e.target.value)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 관리자 답변 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">관리자 답변</label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={5}
              placeholder="답변을 입력하세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* 공개 여부 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm text-gray-700">답변을 공개 게시판에 게시</span>
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '저장 중...' : saved ? '저장되었습니다 ✓' : '저장하기'}
          </button>
        </div>
      </div>
    </main>
  )
}
