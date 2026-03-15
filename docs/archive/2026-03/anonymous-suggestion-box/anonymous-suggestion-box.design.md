# Design: 사내 익명 건의함 (Anonymous Suggestion Box)

> Plan 참조: `docs/01-plan/features/anonymous-suggestion-box.plan.md`

---

## 1. 시스템 아키텍처

### 1.1 전체 구성도

```
┌─────────────────────────────────────────────────────┐
│                   로컬 개발 환경                      │
│                                                     │
│  ┌──────────────┐        ┌──────────────────────┐   │
│  │  브라우저     │ HTTP   │  Next.js 14           │   │
│  │  (직원/관리자)│◄──────►│  (App Router)         │   │
│  └──────────────┘        │  - Pages (RSC)        │   │
│                          │  - API Routes         │   │
│                          │  - NextAuth.js        │   │
│                          └──────────┬───────────┘   │
│                                     │ Prisma ORM    │
│                          ┌──────────▼───────────┐   │
│                          │  PostgreSQL           │   │
│                          │  (Docker Container)   │   │
│                          │  port: 5432           │   │
│                          └──────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 1.2 디렉토리 구조

```
anonymous-suggestion-box/
├── docker-compose.yml
├── .env.local
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx                    # 메인 (건의 제출)
│       ├── track/
│       │   └── page.tsx               # 건의 상태 조회
│       ├── board/
│       │   └── page.tsx               # 공개 건의 게시판
│       ├── admin/
│       │   ├── login/
│       │   │   └── page.tsx           # 관리자 로그인
│       │   └── dashboard/
│       │       ├── page.tsx           # 건의 목록
│       │       └── [id]/
│       │           └── page.tsx       # 건의 상세 + 답변
│       └── api/
│           ├── auth/
│           │   └── [...nextauth]/
│           │       └── route.ts       # NextAuth 핸들러
│           ├── suggestions/
│           │   ├── route.ts           # POST: 건의 제출
│           │   └── [trackingCode]/
│           │       └── route.ts       # GET: 추적 코드 조회
│           └── admin/
│               └── suggestions/
│                   ├── route.ts       # GET: 전체 목록 (관리자)
│                   └── [id]/
│                       └── route.ts   # PATCH: 상태/답변 수정
├── src/
│   ├── components/
│   │   ├── SuggestionForm.tsx
│   │   ├── TrackingResult.tsx
│   │   ├── AdminSuggestionList.tsx
│   │   └── AdminSuggestionDetail.tsx
│   └── lib/
│       ├── prisma.ts                  # Prisma 클라이언트 싱글톤
│       └── auth.ts                    # NextAuth 설정
```

---

## 2. 데이터베이스 설계

### 2.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Category {
  WELFARE       // 복지
  WORK_ENV      // 업무환경
  CULTURE       // 조직문화
  OTHER         // 기타
}

enum Status {
  RECEIVED      // 접수
  REVIEWING     // 검토중
  COMPLETED     // 완료
  PENDING       // 보류
}

model Suggestion {
  id           String    @id @default(uuid())
  trackingCode String    @unique @default(uuid())
  category     Category
  title        String
  content      String
  status       Status    @default(RECEIVED)
  isPublic     Boolean   @default(false)
  adminReply   String?
  repliedAt    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([status])
  @@index([category])
  @@index([createdAt])
}

model Admin {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

### 2.2 ERD

```
Suggestion
┌──────────────┬──────────────┬─────────────┐
│ id (PK)      │ UUID         │ NOT NULL     │
│ trackingCode │ UUID         │ UNIQUE       │
│ category     │ ENUM         │ NOT NULL     │
│ title        │ VARCHAR      │ NOT NULL     │
│ content      │ TEXT         │ NOT NULL     │
│ status       │ ENUM         │ DEFAULT RECV │
│ isPublic     │ BOOLEAN      │ DEFAULT false│
│ adminReply   │ TEXT         │ NULLABLE     │
│ repliedAt    │ TIMESTAMP    │ NULLABLE     │
│ createdAt    │ TIMESTAMP    │ DEFAULT NOW  │
│ updatedAt    │ TIMESTAMP    │ AUTO UPDATE  │
└──────────────┴──────────────┴─────────────┘

Admin
┌──────────────┬──────────────┬─────────────┐
│ id (PK)      │ UUID         │ NOT NULL     │
│ email        │ VARCHAR      │ UNIQUE       │
│ passwordHash │ VARCHAR      │ NOT NULL     │
│ createdAt    │ TIMESTAMP    │ DEFAULT NOW  │
└──────────────┴──────────────┴─────────────┘
```

---

## 3. API 설계

### 3.1 공개 API (인증 불필요)

#### POST /api/suggestions — 건의 제출

**Request Body:**
```json
{
  "category": "WELFARE | WORK_ENV | CULTURE | OTHER",
  "title": "string (max 100자)",
  "content": "string (max 2000자)"
}
```

**Response 201:**
```json
{
  "trackingCode": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response 400:**
```json
{ "error": "title과 content는 필수입니다." }
```

> **익명성**: IP, User-Agent 등 개인식별 정보를 DB에 저장하지 않음

---

#### GET /api/suggestions/[trackingCode] — 건의 상태 조회

**Response 200:**
```json
{
  "category": "WELFARE",
  "title": "휴가 제도 개선 건의",
  "status": "REVIEWING",
  "isPublic": false,
  "adminReply": null,
  "createdAt": "2026-03-15T09:00:00.000Z"
}
```

**Response 404:**
```json
{ "error": "해당 건의를 찾을 수 없습니다." }
```

> **주의**: `content` 본문은 응답에 포함하지 않음 (보안)

---

### 3.2 관리자 API (인증 필요 — NextAuth 세션)

#### GET /api/admin/suggestions — 건의 목록 조회

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `status` | string | 상태 필터 (RECEIVED\|REVIEWING\|COMPLETED\|PENDING) |
| `category` | string | 카테고리 필터 |
| `page` | number | 페이지 번호 (default: 1) |
| `limit` | number | 페이지당 항목 수 (default: 20) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "category": "WELFARE",
      "title": "휴가 제도 개선 건의",
      "status": "RECEIVED",
      "isPublic": false,
      "createdAt": "2026-03-15T09:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

#### PATCH /api/admin/suggestions/[id] — 상태/답변 수정

**Request Body:**
```json
{
  "status": "COMPLETED",
  "adminReply": "검토 결과 내년도 복리후생 예산에 반영하겠습니다.",
  "isPublic": true
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "status": "COMPLETED",
  "adminReply": "검토 결과 내년도 복리후생 예산에 반영하겠습니다.",
  "isPublic": true,
  "repliedAt": "2026-03-20T14:00:00.000Z"
}
```

---

## 4. 화면 설계

### 4.1 메인 페이지 — 건의 제출 (`/`)

```
┌──────────────────────────────────────────┐
│          사내 익명 건의함                 │
│   당신의 의견은 완전히 익명으로 처리됩니다  │
├──────────────────────────────────────────┤
│                                          │
│  카테고리 *                              │
│  ┌────────────────────────────────────┐  │
│  │ [복지] [업무환경] [조직문화] [기타] │  │
│  └────────────────────────────────────┘  │
│                                          │
│  제목 *                                  │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  내용 *                                  │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│         [ 익명으로 제출하기 ]            │
│                                          │
│  ──────────────────────────────────────  │
│  건의 상태 확인하기 → /track             │
└──────────────────────────────────────────┘
```

### 4.2 제출 완료 모달

```
┌────────────────────────────────┐
│  ✅ 건의가 접수되었습니다       │
│                                │
│  추적 코드                      │
│  ┌──────────────────────────┐  │
│  │ 550e8400-e29b-41d4-a716  │  │
│  │            [복사]         │  │
│  └──────────────────────────┘  │
│                                │
│  ⚠️ 이 코드는 다시 확인할 수   │
│  없습니다. 반드시 저장하세요.   │
│                                │
│         [ 확인 ]               │
└────────────────────────────────┘
```

### 4.3 건의 상태 조회 (`/track`)

```
┌──────────────────────────────────────────┐
│          건의 상태 확인                   │
├──────────────────────────────────────────┤
│                                          │
│  추적 코드를 입력하세요                  │
│  ┌────────────────────────────────────┐  │
│  │ 550e8400-e29b-41d4-a716-...        │  │
│  └────────────────────────────────────┘  │
│         [ 조회하기 ]                     │
│                                          │
│  ──────────────────────────────────────  │
│  📋 조회 결과                            │
│  카테고리: 복지                          │
│  제목: 휴가 제도 개선 건의               │
│  상태: 🔄 검토중                         │
│  접수일: 2026-03-15                      │
│                                          │
│  📝 관리자 답변                          │
│  (아직 답변이 없습니다)                  │
└──────────────────────────────────────────┘
```

### 4.4 관리자 대시보드 (`/admin/dashboard`)

```
┌──────────────────────────────────────────────────────┐
│  관리자 대시보드                    [로그아웃]        │
├──────────────────────────────────────────────────────┤
│  필터: [전체▼] [카테고리▼] [최신순▼]                 │
├────┬──────────────┬────────┬──────────┬──────────────┤
│ #  │ 제목         │ 카테고리│ 상태     │ 접수일       │
├────┼──────────────┼────────┼──────────┼──────────────┤
│  1 │ 휴가 제도... │ 복지   │ 🆕 접수  │ 2026-03-15  │
│  2 │ 사무실 온도  │ 업무환경│ 🔄 검토중│ 2026-03-14  │
│  3 │ 회식 문화... │ 조직문화│ ✅ 완료  │ 2026-03-10  │
└────┴──────────────┴────────┴──────────┴──────────────┘
│                          [ < 1 2 3 > ]               │
└──────────────────────────────────────────────────────┘
```

### 4.5 건의 상세 + 답변 (`/admin/dashboard/[id]`)

```
┌──────────────────────────────────────────┐
│  [← 목록으로]                            │
├──────────────────────────────────────────┤
│  카테고리: 복지   접수일: 2026-03-15     │
│  제목: 휴가 제도 개선 건의               │
│                                          │
│  내용:                                   │
│  현재 연차 사용 시 팀장 승인이 필요한    │
│  절차가 너무 복잡합니다...               │
│                                          │
│  ──────────────────────────────────────  │
│  처리 상태                               │
│  ○ 접수  ● 검토중  ○ 완료  ○ 보류       │
│                                          │
│  관리자 답변                             │
│  ┌────────────────────────────────────┐  │
│  │ 소중한 의견 감사합니다...           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  □ 답변을 전체 공개 게시판에 게시        │
│                                          │
│         [ 저장하기 ]                     │
└──────────────────────────────────────────┘
```

---

## 5. 인증 설계 (NextAuth.js)

### 5.1 관리자 인증 흐름

```
관리자 브라우저
    │
    ▼ POST /api/auth/signin (email, password)
NextAuth Credentials Provider
    │
    ▼ DB 조회 (Admin 테이블)
bcrypt.compare(password, passwordHash)
    │
    ├─ 실패 → 401 Unauthorized
    │
    └─ 성공 → JWT 세션 쿠키 발급
                  │
                  ▼ GET /admin/dashboard
              미들웨어 (middleware.ts)
                  │ 세션 검증
                  ├─ 없음 → /admin/login redirect
                  └─ 있음 → 페이지 허용
```

### 5.2 미들웨어 보호 경로

```typescript
// middleware.ts
export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/admin/:path*']
}
```

---

## 6. 환경 변수

```bash
# .env.local
DATABASE_URL="postgresql://suggestion_user:suggestion_pass@localhost:5432/suggestion_box"
NEXTAUTH_SECRET="로컬_개발용_랜덤_시크릿_키"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 7. Docker Compose 구성

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16-alpine
    container_name: suggestion-box-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: suggestion_user
      POSTGRES_PASSWORD: suggestion_pass
      POSTGRES_DB: suggestion_box
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U suggestion_user -d suggestion_box"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## 8. 시드 데이터 (초기 관리자 계정)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin1234!', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      passwordHash,
    },
  })
  console.log('관리자 계정 생성 완료: admin@company.com / admin1234!')
}

main().finally(() => prisma.$disconnect())
```

---

## 9. 구현 순서 (Do Phase 기준)

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | Docker + PostgreSQL 실행 | `docker-compose.yml` |
| 2 | Next.js 프로젝트 초기화 | `npx create-next-app` |
| 3 | Prisma 스키마 + 마이그레이션 | `prisma/schema.prisma` |
| 4 | 시드 데이터 (관리자 계정) | `prisma/seed.ts` |
| 5 | NextAuth.js 설정 | `src/lib/auth.ts`, `api/auth/[...nextauth]` |
| 6 | 관리자 미들웨어 | `middleware.ts` |
| 7 | 건의 제출 API | `api/suggestions/route.ts` |
| 8 | 건의 제출 페이지 | `app/page.tsx`, `SuggestionForm.tsx` |
| 9 | 추적 코드 조회 API + 페이지 | `api/suggestions/[trackingCode]`, `app/track` |
| 10 | 관리자 대시보드 API + 페이지 | `api/admin/suggestions`, `app/admin/dashboard` |
| 11 | 건의 상세 + 답변 페이지 | `app/admin/dashboard/[id]` |
| 12 | 공개 게시판 페이지 | `app/board/page.tsx` |
