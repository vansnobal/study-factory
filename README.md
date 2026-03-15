# 바이브코딩 실습 가이드

* 대상: 비개발자 / 코딩 입문자
* 목표: AI와 함께 1시간 안에 실무형 풀스택 웹앱 만들기
* 샘플: 사내 익명 건의함 (Next.js + Docker PostgreSQL)

---

## 목차

1. [bkit란 무엇인가?](#1-bkit란-무엇인가)
2. [PDCA 사이클이란?](#2-pdca-사이클이란)
3. [PDCA 커맨드 목록](#3-pdca-커맨드-목록)
4. [사전 준비](#4-사전-준비)
5. [실습: 사내 익명 건의함 만들기](#5-실습-사내-익명-건의함-만들기)
   - [Step 0. 브랜치 생성](#step-0-브랜치-생성)
   - [Step 1. 아이디어 선정](#step-1-아이디어-선정)
   - [Step 2. Plan — 기획 문서 작성](#step-2-plan--기획-문서-작성)
   - [Step 3. Design — 설계 문서 작성](#step-3-design--설계-문서-작성)
   - [Step 4. Do — 구현](#step-4-do--구현)
   - [Step 5. Check — Gap 분석](#step-5-check--gap-분석)
   - [Step 6. Act — 자동 개선](#step-6-act--자동-개선)
   - [Step 7. Report — 완료 보고서](#step-7-report--완료-보고서)
   - [Step 8. Archive — 문서 보관](#step-8-archive--문서-보관)
6. [실행 및 확인 방법](#6-실행-및-확인-방법)
7. [트러블슈팅](#7-트러블슈팅)

---

## 1. bkit란 무엇인가?

**bkit(비킷)**은 비개발자도 AI와 함께 실제로 동작하는 앱을 만들 수 있도록 돕는 **바이브코딩 키트**입니다.

### 핵심 개념

- **바이브코딩(Vibe Coding)**: 코드를 직접 작성하지 않고, AI에게 원하는 것을 말하면 AI가 코드를 만들어주는 방식
- **Claude Code**: Anthropic이 만든 AI 코딩 도우미 (터미널에서 실행)
- **bkit**: Claude Code 위에서 동작하는 개발 방법론 + 커맨드 모음

### bkit가 해결하는 문제

| 기존 방식 | bkit 방식 |
|----------|----------|
| 코드를 직접 배워야 함 | 원하는 것을 말하면 AI가 구현 |
| 어디서 시작할지 막막함 | PDCA 단계별 커맨드로 안내 |
| 기획 → 구현 → 검증이 따로 놈 | 하나의 흐름으로 연결 |
| 품질 검증 방법을 모름 | Match Rate로 수치 확인 |

---

## 2. PDCA 사이클이란?

bkit는 **PDCA 사이클**을 따라 앱을 만들어 나갑니다.

```
Plan → Design → Do → Check → Act → Report → Archive
 기획     설계    구현   검증    개선   완료보고   보관
```

### 각 단계 설명

| 단계 | 역할 | AI가 하는 일 |
|------|------|-------------|
| **Plan** | 무엇을 만들지 결정 | 기획 문서 자동 작성 (목적, 기능 목록, 기술 스택) |
| **Design** | 어떻게 만들지 설계 | DB 스키마, API 명세, 화면 구조 설계 문서 작성 |
| **Do** | 실제 코드 구현 | 모든 파일 자동 생성 및 설정 |
| **Check** | 설계대로 만들어졌는지 검증 | gap-detector가 설계 vs 구현 비교 → Match Rate 산출 |
| **Act** | 부족한 부분 자동 개선 | pdca-iterator가 코드 자동 수정 |
| **Report** | 완료 보고서 작성 | report-generator가 전 과정 요약 |
| **Archive** | 문서 보관 | PDCA 산출물을 아카이브 폴더로 이동 |

### PDCA의 핵심: Match Rate

- Check 단계에서 **Match Rate(일치율)**를 측정합니다
- **기준: 90% 이상** → 완료 가능
- **90% 미만** → Act 단계에서 자동 개선 후 재검증

```
설계한 것 vs 실제 구현된 것 = Match Rate
        90% 이상이면 합격!
```

---

## 3. PDCA 커맨드 목록

Claude Code 터미널에서 `/` 로 시작하는 커맨드를 입력하면 실행됩니다.

### 핵심 PDCA 커맨드

| 커맨드 | 설명 | 예시 |
|--------|------|------|
| `/pdca plan {기능명}` | Plan 문서 작성 | `/pdca plan 사내 익명 건의함` |
| `/pdca design {기능명}` | Design 문서 작성 | `/pdca design 사내 익명 건의함` |
| `/pdca do {기능명}` | 구현 시작 가이드 | `/pdca do 사내 익명 건의함` |
| `/pdca analyze {기능명}` | Gap 분석 실행 | `/pdca analyze 사내 익명 건의함` |
| `/pdca iterate {기능명}` | 자동 개선 실행 | `/pdca iterate 사내 익명 건의함` |
| `/pdca report {기능명}` | 완료 보고서 생성 | `/pdca report 사내 익명 건의함` |
| `/pdca archive {기능명}` | 문서 아카이브 | `/pdca archive 사내 익명 건의함` |
| `/pdca status` | 현재 진행 상태 확인 | `/pdca status` |
| `/pdca next` | 다음 단계 안내 | `/pdca next` |

### 자동 실행되는 AI 에이전트

| 에이전트 | 실행 시점 | 하는 일 |
|---------|---------|--------|
| `gap-detector` | Check 단계 | 설계 문서 vs 구현 코드 비교 분석 |
| `pdca-iterator` | Act 단계 | Gap 목록 기반으로 코드 자동 수정 |
| `report-generator` | Report 단계 | 전체 과정 요약 보고서 작성 |

### 자연어로도 실행 가능

커맨드 외에 자연어로 말해도 AI가 알아서 처리합니다:

```
gap-detector를 이용하여 초기 design과 비교해줘
모든 항목에서 98% 이상을 만족해라
```

---

## 4. 사전 준비

실습을 시작하기 전에 아래를 설치해야 합니다.

### 필수 설치 항목

| 도구 | 용도 | 설치 확인 명령어 |
|------|------|----------------|
| [Node.js 18+](https://nodejs.org) | Next.js 실행 | `node -v` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | PostgreSQL 실행 | `docker -v` |
| [Claude Code](https://claude.ai/code) | AI 코딩 도우미 | `claude -v` |
| bkit 플러그인 | PDCA 커맨드 | Claude Code 설치 후 자동 |

### 프로젝트 폴더 준비

```bash
# 실습 폴더 생성
mkdir ~/my-bkit-project
cd ~/my-bkit-project

# Claude Code 실행
claude
```

> Claude Code를 실행하면 터미널이 AI 대화창으로 바뀝니다.
> 이제부터 커맨드 또는 자연어로 AI에게 지시하면 됩니다.

---

## 5. 실습: 사내 익명 건의함 만들기

**완성 목표**: 직원이 익명으로 건의사항을 등록하고, 관리자가 처리 상태를 관리하는 웹앱

| 항목 | 내용 |
|------|------|
| 기술 스택 | Next.js 15 + Prisma + Docker PostgreSQL + Tailwind CSS |
| 화면 | 사용자 화면(`/`) + 관리자 화면(`/admin`) |
| 기능 | 건의 등록 / 목록 조회 / 상태 변경 (접수→검토중→완료) |
| 예상 시간 | 약 1시간 |

---

### Step 0. 브랜치 생성

실습을 시작하기 전에 **본인 전용 브랜치**를 먼저 만듭니다.

**브랜치 명명 규칙:** `계정명 + 날짜 (MMDD)`

**예시:**
```
hong0313   ← 홍길동, 3월 13일
kim0315    ← 김철수, 3월 15일
lee0401    ← 이영희, 4월 01일
```

**터미널에서 실행 (Claude Code 바깥 일반 터미널):**
```bash
# 본인 계정명과 오늘 날짜로 브랜치 생성
git checkout -b hong0313
```

> 브랜치를 따로 만드는 이유: 여러 사람이 같은 저장소에서 실습할 때 작업이 섞이지 않도록 하기 위함입니다.

**👉 한 줄 요약**: 실습 전에 반드시 본인 브랜치를 먼저 만드세요.

---

### Step 1. 아이디어 선정

Claude Code 터미널에서 아래 내용을 그대로 입력합니다.

**입력 (자연어):**
```
bkit를 활용하여 사내 익명 건의함 프로젝트를 만들고 싶다.
로컬 DB를 Docker로 띄워서 사용하고,
Next.js로 백엔드와 프론트엔드를 모두 구현하는 형태로 해줘.
```

**AI 응답 예시:**
- 프로젝트 구성 방향 제안
- 기술 스택 추천 (Next.js + Prisma + Docker PostgreSQL)

**👉 한 줄 요약**: AI에게 만들고 싶은 것을 자연어로 설명하면 방향을 잡아줍니다.

---

### Step 2. Plan — 기획 문서 작성

**입력 (커맨드):**
```
/pdca plan 사내 익명 건의함
```

**AI가 자동으로 하는 일:**
1. `docs/01-plan/features/` 폴더 생성
2. 기획 문서(`사내-익명-건의함.plan.md`) 작성
3. 아래 내용이 자동으로 채워짐

**생성되는 기획 문서 핵심 내용:**

| 항목 | 내용 |
|------|------|
| 목적 | 익명 건의사항 등록 + 관리자 상태 관리 |
| 범위 (포함) | 건의 등록, 목록 조회, 관리자 상태 변경, Docker DB |
| 범위 (제외) | 로그인/인증, 파일 첨부, 이메일 알림 |
| 기술 스택 | Next.js 15, Prisma, PostgreSQL, Tailwind CSS |

**기획 문서 위치:** `docs/01-plan/features/사내-익명-건의함.plan.md`

**👉 한 줄 요약**: 커맨드 하나로 기획 문서가 자동 완성됩니다.

---

### Step 3. Design — 설계 문서 작성

**입력 (커맨드):**
```
/pdca design 사내 익명 건의함
```

**AI가 자동으로 하는 일:**
1. Plan 문서를 읽고 설계 문서 작성
2. DB 스키마, API 명세, 화면 구조, 구현 순서 정의

**생성되는 설계 내용:**

**DB 스키마 (Prisma):**
```prisma
model Suggestion {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(100)      // 제목 (최대 100자)
  content   String   @db.VarChar(1000)     // 내용 (최대 1000자)
  category  Category @default(OTHER)       // 카테고리 (복지/업무환경/조직문화/기타)
  status    Status   @default(PENDING)     // 상태 (접수/검토중/완료)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**API 명세:**

| Method | 주소 | 기능 |
|--------|------|------|
| `GET` | `/api/suggestions` | 건의 목록 조회 |
| `POST` | `/api/suggestions` | 새 건의 등록 |
| `PATCH` | `/api/suggestions/[id]` | 상태 변경 |

**구현 순서 (14단계):**
1. `docker-compose.yml` 작성
2. `.env.local` 환경변수 설정
3. `prisma/schema.prisma` 작성 → DB 마이그레이션
4. `lib/prisma.ts` Prisma 클라이언트 설정
5. `types/suggestion.ts` 타입 정의
6. `app/api/suggestions/route.ts` (GET, POST)
7. `app/api/suggestions/[id]/route.ts` (PATCH)
8. `components/SuggestionForm.tsx` 건의 등록 폼
9. `components/SuggestionCard.tsx` 건의 카드
10. `components/StatusBadge.tsx` 상태 뱃지
11. `app/page.tsx` 사용자 화면
12. `components/AdminCard.tsx` 관리자 카드
13. `app/admin/page.tsx` 관리자 화면
14. 통합 테스트

**설계 문서 위치:** `docs/02-design/features/사내-익명-건의함.design.md`

**👉 한 줄 요약**: DB 구조, API, 화면 설계까지 AI가 자동으로 문서화합니다.

---

### Step 4. Do — 구현

> **먼저 Docker Desktop을 실행해주세요.**

**입력 (커맨드):**
```
/pdca do 사내 익명 건의함
```

**AI가 자동으로 생성하는 파일 (13개):**

| 파일 | 역할 |
|------|------|
| `docker-compose.yml` | PostgreSQL 컨테이너 설정 |
| `.env` / `.env.local` | DB 연결 정보 |
| `prisma/schema.prisma` | DB 스키마 정의 |
| `lib/prisma.ts` | DB 연결 클라이언트 |
| `types/suggestion.ts` | 타입 + 한글 레이블 정의 |
| `app/api/suggestions/route.ts` | 목록 조회 + 건의 등록 API |
| `app/api/suggestions/[id]/route.ts` | 상태 변경 API |
| `components/SuggestionForm.tsx` | 건의 등록 폼 |
| `components/SuggestionCard.tsx` | 건의 카드 (사용자용) |
| `components/StatusBadge.tsx` | 상태 뱃지 (색상 구분) |
| `components/AdminCard.tsx` | 관리자 카드 (상태 변경) |
| `app/page.tsx` | 사용자 화면 |
| `app/admin/page.tsx` | 관리자 대시보드 |

**구현 후 직접 실행하는 명령어 (터미널에서):**

```bash
# 1. PostgreSQL 컨테이너 시작
docker compose up -d

# 2. DB 테이블 생성 (마이그레이션)
npx prisma migrate dev --name init

# 3. 개발 서버 실행
npm run dev
```

**접속 주소:**
- 사용자 화면: http://localhost:3000
- 관리자 화면: http://localhost:3000/admin

**👉 한 줄 요약**: 코드 한 줄 안 짜도 AI가 전부 만들어줍니다.

---

### Step 5. Check — Gap 분석

구현이 끝나면 **설계대로 만들어졌는지 자동으로 검증**합니다.

**입력 (자연어):**
```
gap-detector를 이용하여 초기 design과 비교해줘
```

**AI(gap-detector)가 하는 일:**
1. 설계 문서 vs 구현 코드 전체 비교
2. 8개 카테고리별 Match Rate 산출
3. Missing / Changed / Added 항목 목록 생성

**결과 예시:**

| 카테고리 | 점수 | 상태 |
|----------|:----:|:----:|
| DB Schema | 92% | ✅ |
| API Endpoints | 82% | ⚠️ |
| Error Handling | 83% | ⚠️ |
| Components | 100% | ✅ |
| Pages | 94% | ✅ |
| Security | 92% | ✅ |
| Architecture | 100% | ✅ |
| Convention | 100% | ✅ |
| **전체** | **90%** | **✅ 기준 충족** |

> Match Rate **90% 이상** → 다음 단계 진행 가능
> Match Rate **90% 미만** → Act 단계에서 자동 개선 필요

**분석 결과 파일:** `docs/03-analysis/사내-익명-건의함.analysis.md`

**👉 한 줄 요약**: AI가 "얼마나 잘 만들었는지" 수치로 알려줍니다.

---

### Step 6. Act — 자동 개선

Match Rate가 기준을 넘었더라도, 더 높은 품질을 원하면 자동 개선을 요청합니다.

**입력 (자연어 커맨드):**
```
/pdca iterator 사내 익명 건의함 모든항목에 98%를 만족해라.
```

**AI(pdca-iterator)가 하는 일:**
1. Gap 분석 결과에서 미달 항목 자동 파악
2. 코드 자동 수정
3. gap-detector 재실행으로 목표 달성 확인

**자동 수정된 파일 (5개):**

| 파일 | 개선 내용 |
|------|---------|
| `app/api/suggestions/[id]/route.ts` | 존재하지 않는 ID 요청 시 404 반환 추가 |
| `app/api/suggestions/route.ts` | 카테고리 필터 기능 추가, 서버 검증 강화 |
| `components/AdminCard.tsx` | 에러 메시지 UI, 성공 피드백 추가 |
| `app/page.tsx` | 건의 등록 성공 알림 배너 추가 |
| `app/admin/page.tsx` | 상태 변경 성공 피드백 추가 |

**개선 결과:**

| 카테고리 | Before | After |
|----------|:------:|:-----:|
| API Endpoints | 82% | **99%** |
| Error Handling | 83% | **98%** |
| DB Schema | 92% | **98%** |
| Pages | 94% | **98%** |
| Security | 92% | **100%** |
| **전체** | **90%** | **99%** |

**👉 한 줄 요약**: 목표 수치를 말하면 AI가 자동으로 코드를 고쳐줍니다.

---

### Step 7. Report — 완료 보고서

**입력 (커맨드):**
```
/pdca report 사내 익명 건의함
```

**AI(report-generator)가 생성하는 보고서 내용:**
- 프로젝트 Executive Summary (4관점 분석)
- PDCA 단계별 결과 요약
- 구현 완료 기능 체크리스트
- 최종 Match Rate 및 카테고리별 점수
- 핵심 학습 내용

**보고서 Executive Summary:**

| 관점 | 내용 |
|------|------|
| **Problem** | 사내 건의사항 익명 전달 채널 부재 |
| **Solution** | Next.js + Docker PostgreSQL, 1시간 내 풀스택 구축 |
| **Function/UX** | 등록 토스트 + 관리자 상태 변경 즉시 반영 |
| **Core Value** | 비개발자도 AI와 실무 앱을 1시간에 완성 |

**최종 성과:**

| 항목 | 결과 |
|------|------|
| 구현 파일 수 | 13개 |
| 기능 완료 | 6/6 (100%) |
| 최종 Match Rate | **99%** |
| 자동 개선 횟수 | 1회 |
| 총 소요 시간 | 약 1시간 |

**보고서 파일:** `docs/04-report/사내-익명-건의함.report.md`

**👉 한 줄 요약**: 전체 과정이 한 장의 보고서로 자동 정리됩니다.

---

### Step 8. Archive — 문서 보관

**입력 (커맨드):**
```
/pdca archive 사내 익명 건의함
```

**AI가 하는 일:**
- PDCA 4개 문서를 `docs/archive/YYYY-MM/사내-익명-건의함/` 으로 이동
- Archive Index 파일 자동 생성

**보관 구조:**
```
docs/archive/2026-03/
├── _INDEX.md                          ← 보관 목록
└── 사내-익명-건의함/
    ├── 사내-익명-건의함.plan.md
    ├── 사내-익명-건의함.design.md
    ├── 사내-익명-건의함.analysis.md
    └── 사내-익명-건의함.report.md
```

**👉 한 줄 요약**: 완료된 프로젝트 문서를 깔끔하게 보관합니다.

---

## 6. 실행 및 확인 방법

### 전체 PDCA 흐름 한눈에 보기

```
[1단계] 아이디어 설명 (자연어)
    ↓
[2단계] /pdca plan 사내 익명 건의함
    ↓
[3단계] /pdca design 사내 익명 건의함
    ↓
[4단계] /pdca do 사내 익명 건의함
         → docker compose up -d
         → npx prisma migrate dev --name init
         → npm run dev
    ↓
[5단계] gap-detector를 이용하여 초기 design과 비교해줘
    ↓
[6단계] /pdca iterator 사내 익명 건의함 모든항목에 98%를 만족해라.
    ↓
[7단계] /pdca report 사내 익명 건의함
    ↓
[8단계] /pdca archive 사내 익명 건의함
```

### 앱 동작 확인 (브라우저)

| 주소 | 화면 | 할 수 있는 것 |
|------|------|-------------|
| http://localhost:3000 | 사용자 화면 | 건의사항 익명 등록, 목록 확인 |
| http://localhost:3000/admin | 관리자 화면 | 전체 건의 목록, 상태 변경 (접수→검토중→완료) |

### DB 데이터 직접 확인 (터미널)

```bash
# DB 테이블 목록 확인
docker exec suggestion-db psql -U admin -d suggestion_box -c "\dt"

# 저장된 건의 데이터 조회
docker exec suggestion-db psql -U admin -d suggestion_box \
  -c "SELECT id, title, category, status FROM \"Suggestion\" ORDER BY \"createdAt\" DESC LIMIT 5;"
```

---

## 7. 트러블슈팅

### Docker 관련

**문제**: `Cannot connect to the Docker daemon`
```
해결: Docker Desktop 앱을 실행한 후 다시 시도
```

**문제**: Docker 이미지 다운로드 실패 (I/O error)
```
해결: Docker Desktop → Settings → Troubleshoot → Clean / Purge data
      이후 docker compose up -d 재실행
```

### Prisma 관련

**문제**: `The datasource property url is no longer supported`
```
해결: Prisma 7 변경사항. prisma.config.ts 파일이 자동 생성되어 있으므로
      schema.prisma의 url = env("DATABASE_URL") 라인을 삭제
```

**문제**: Authentication failed (DB 연결 실패)
```
해결: .env 파일에 DATABASE_URL이 올바르게 설정되었는지 확인
      DATABASE_URL="postgresql://admin:password123@localhost:5432/suggestion_box"
```

**문제**: `PrismaClientConstructorValidationError` (adapter 오류)
```
해결: npm install pg @prisma/adapter-pg 설치 후
      lib/prisma.ts에서 PrismaPg adapter 방식으로 연결
```

### 포트 충돌

**문제**: `Port 3000 is already in use`
```
해결: lsof -ti:3000 | xargs kill -9
      이후 npm run dev 재실행
```

**문제**: `Port 5432 is already in use`
```
해결: 기존에 실행 중인 PostgreSQL이 있는지 확인
      docker ps 로 컨테이너 상태 확인
```

---

## 마치며

bkit PDCA 사이클을 통해 이런 것을 경험했습니다:

| 배운 것 | 내용 |
|--------|------|
| **바이브코딩의 실체** | 코드 없이 커맨드와 자연어만으로 실제 앱 완성 |
| **AI와 협업하는 법** | 무엇을 말해야 AI가 잘 만드는지 감각 습득 |
| **품질 수치화** | Match Rate로 "잘 만들어졌는지" 객관적 확인 |
| **자동 개선의 힘** | 목표 수치를 말하면 AI가 알아서 고침 |
| **문서의 중요성** | Plan → Design이 있어야 Do가 잘 됨 |

> 코드를 몰라도 **무엇을 만들고 싶은지** 알면 시작할 수 있습니다.
> bkit는 그 아이디어를 실제 동작하는 앱으로 만들어줍니다.
