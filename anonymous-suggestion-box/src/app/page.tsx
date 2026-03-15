'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'WELFARE', label: '복지' },
  { value: 'WORK_ENV', label: '업무환경' },
  { value: 'CULTURE', label: '조직문화' },
  { value: 'OTHER', label: '기타' },
] as const

type Category = typeof CATEGORIES[number]['value']

export default function HomePage() {
  const [category, setCategory] = useState<Category>('OTHER')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [trackingCode, setTrackingCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title, content }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '오류가 발생했습니다.')
        return
      }
      setTrackingCode(data.trackingCode)
      setTitle('')
      setContent('')
    } catch {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!trackingCode) return
    await navigator.clipboard.writeText(trackingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">사내 익명 건의함</h1>
          <p className="mt-2 text-sm text-gray-500">당신의 의견은 완전히 익명으로 처리됩니다</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      category === cat.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
                placeholder="건의 제목을 입력해주세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                required
                rows={6}
                placeholder="건의 내용을 자세히 입력해주세요 (최대 2000자)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-right text-xs text-gray-400 mt-1">{content.length} / 2000</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '제출 중...' : '익명으로 제출하기'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          건의 상태 확인하기 →{' '}
          <Link href="/track" className="text-blue-600 hover:underline">
            추적 코드로 조회
          </Link>
        </p>
      </div>

      {trackingCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">✅</div>
              <h2 className="text-lg font-bold text-gray-900">건의가 접수되었습니다</h2>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">추적 코드</p>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <code className="flex-1 text-xs text-gray-800 break-all">{trackingCode}</code>
                <button
                  onClick={handleCopy}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium shrink-0"
                >
                  {copied ? '복사됨!' : '복사'}
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-amber-800">
                ⚠️ 이 코드는 다시 확인할 수 없습니다. 반드시 저장해두세요.
              </p>
            </div>

            <button
              onClick={() => setTrackingCode(null)}
              className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
