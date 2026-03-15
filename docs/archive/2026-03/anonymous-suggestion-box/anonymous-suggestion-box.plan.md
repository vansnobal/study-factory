# Plan: 사내 익명 건의함 (Anonymous Suggestion Box)

## Executive Summary

| 항목 | 내용 |
|------|------|
| Feature | anonymous-suggestion-box |
| 시작일 | 2026-03-15 |
| 목표 완료일 | 2026-04-05 |
| 예상 기간 | 3주 |
| 프로젝트 레벨 | Dynamic |
| 기술 스택 | Next.js 14 + Prisma + PostgreSQL |

### Value Delivered (4-Perspective Table)

| 관점 | 내용 |
|------|------|
| **Problem** | 직원들이 신분 노출 우려로 불만·제안을 솔직히 전달하지 못해 조직 개선 기회를 놓침 |
| **Solution** | 완전 익명 보장 + 상태 추적 + 카테고리 분류로 신뢰할 수 있는 건의 채널 제공 |
| **Function UX Effect** | 로그인 없이 건의 가능, 관리자 대시보드에서 답변·상태 관리, 건의자는 고유 코드로 진행 상황 확인 |
| **Core Value** | 심리적 안전감을 높여 직원 목소리가 조직 의사결정에 반영되는 문화 형성 |

---

## 1. 프로젝트 개요

### 1.1 배경 및 목적

사내에서 직원들이 조직 문화, 복지, 업무 환경 등에 대한 불만이나 개선 제안을 자유롭게 표현하기 어려운 환경이 존재한다. 익명성이 보장되지 않으면 발언에 대한 불이익 우려로 솔직한 의견 개진이 어렵다. 본 프로젝트는 **완전한 익명성을 보장**하는 건의함을 구축하여 직원들이 심리적 안전감을 갖고 의견을 제출할 수 있는 채널을 마련한다.

### 1.2 목표

1. 직원이 로그인 없이 익명으로 건의 내용을 제출할 수 있다
2. 관리자가 건의 내용을 확인하고 카테고리 분류 및 상태를 관리할 수 있다
3. 건의자가 고유 추적 코드로 자신의 건의 상태와 답변을 확인할 수 있다
4. 시스템이 건의자 IP·기기 정보를 저장하지 않아 완전한 익명성을 보장한다

### 1.3 성공 지표 (KPI)

- 건의 제출률: 서비스 오픈 후 1달 내 전체 직원의 20% 이상 참여
- 처리 완료율: 접수된 건의의 80% 이상을 2주 내 답변 제공
- 재방문율: 건의 제출자의 50% 이상이 추적 코드로 답변 확인

---

## 2. 사용자 및 역할

### 2.1 사용자 유형

| 역할 | 설명 | 인증 방식 |
|------|------|-----------|
| **익명 직원** | 건의를 제출하는 모든 직원 | 인증 없음 (완전 익명) |
| **관리자** | 건의를 확인·처리·답변하는 HR/운영 담당자 | ID/PW 로그인 |

### 2.2 핵심 사용자 시나리오

**시나리오 A - 직원 건의 제출:**
1. 직원이 사이트 접속
2. 카테고리 선택 (복지/업무환경/조직문화/기타)
3. 익명 건의 내용 작성 및 제출
4. 시스템이 고유 추적 코드(UUID) 발급
5. 직원이 코드를 보관하여 추후 상태 확인에 활용

**시나리오 B - 관리자 처리:**
1. 관리자가 로그인
2. 새 건의 목록 확인
3. 건의를 읽고 답변 작성
4. 처리 상태 변경 (접수→검토중→완료)
5. 공개/비공개 답변 선택하여 저장

**시나리오 C - 건의 상태 확인:**
1. 직원이 발급받은 추적 코드 입력
2. 본인 건의의 현재 상태 및 답변 확인

---

## 3. 핵심 기능 목록

### 3.1 익명 건의 제출 (Must Have)

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 익명 건의 작성 | 로그인 없이 카테고리+제목+내용 입력 | P0 |
| 추적 코드 발급 | 제출 후 고유 UUID 코드 표시 (1회 표시) | P0 |
| 익명성 보장 | 서버에 IP·기기 정보 미저장 | P0 |
| 카테고리 선택 | 복지/업무환경/조직문화/기타 선택 | P1 |

### 3.2 관리자 대시보드 (Must Have)

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 건의 목록 조회 | 카테고리·상태·날짜별 필터링 | P0 |
| 건의 상세 보기 | 내용 확인 및 답변 작성 | P0 |
| 상태 관리 | 접수 / 검토중 / 완료 / 보류 상태 변경 | P0 |
| 공개 답변 | 전체 직원에게 공개되는 답변 작성 | P1 |
| 관리자 인증 | 관리자 ID/PW 로그인 | P0 |

### 3.3 건의 추적 (Should Have)

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 코드로 조회 | 추적 코드 입력 → 내 건의 상태·답변 확인 | P1 |
| 공개 건의 게시판 | 공개 처리된 건의·답변을 전 직원이 조회 | P2 |

### 3.4 추후 고려 사항 (Nice to Have)

- 이메일 알림 (익명 이메일 사용 시 선택)
- 통계 대시보드 (카테고리별/월별 건의 통계)
- 다국어 지원

---

## 4. 기술 스택

### 4.1 선택 스택

| 레이어 | 기술 | 선택 이유 |
|--------|------|-----------|
| Frontend | Next.js 14 (App Router) | SSR + API Routes 통합, 내부 도구로 최적 |
| ORM | Prisma | TypeScript 타입 안전, 마이그레이션 관리 용이 |
| Database | PostgreSQL (Docker) | 로컬 환경 독립성 보장, 팀원 간 동일한 DB 버전 유지 |
| 인증 | NextAuth.js | 관리자 로그인 (Credentials Provider) |
| Styling | Tailwind CSS | 빠른 UI 개발 |
| 로컬 인프라 | Docker + Docker Compose | PostgreSQL 컨테이너 기반 로컬 개발 환경 |

### 4.2 로컬 개발 환경 (Docker)

로컬 개발은 **Docker Compose**로 PostgreSQL을 컨테이너로 실행한다. 팀원 누구나 동일한 환경에서 개발할 수 있도록 `docker-compose.yml`로 구성을 명시한다.

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

volumes:
  postgres_data:
```

```bash
# .env.local
DATABASE_URL="postgresql://suggestion_user:suggestion_pass@localhost:5432/suggestion_box"
```

**로컬 개발 시작 절차:**
```bash
docker compose up -d          # PostgreSQL 컨테이너 시작
npx prisma migrate dev        # DB 마이그레이션 실행
npx prisma db seed            # 관리자 초기 계정 생성
npm run dev                   # Next.js 개발 서버 시작
```

**컨테이너 관리:**
```bash
docker compose down           # 컨테이너 중지
docker compose down -v        # 컨테이너 + 볼륨 삭제 (DB 초기화)
docker compose logs db        # DB 로그 확인
```

### 4.3 익명성 보장 아키텍처

```
직원 브라우저
     │ HTTPS (IP 헤더 제거)
     ▼
Next.js API Routes
     │ 개인식별 정보 제거 후 저장
     ▼
PostgreSQL
  - suggestions 테이블: IP·User-Agent 미포함
  - tracking_code: UUID만 저장 (역추적 불가)
```

**익명성 보장 원칙:**
1. `X-Forwarded-For`, `User-Agent` 헤더를 DB에 저장하지 않음
2. 추적 코드는 UUID v4로 생성 (예측 불가)
3. 관리자도 건의자 신원 확인 불가

---

## 5. 데이터 모델 (초안)

```
Suggestion
├── id (UUID, PK)
├── trackingCode (UUID, 건의자 추적용)
├── category (ENUM: WELFARE | WORK_ENV | CULTURE | OTHER)
├── title (String)
├── content (String)
├── status (ENUM: RECEIVED | REVIEWING | COMPLETED | PENDING)
├── isPublic (Boolean, 공개 답변 여부)
├── adminReply (String?, 관리자 답변)
├── repliedAt (DateTime?)
└── createdAt (DateTime)

Admin
├── id (UUID, PK)
├── email (String)
├── passwordHash (String)
└── createdAt (DateTime)
```

---

## 6. 구현 단계별 계획

### Phase 1 — 기반 구성 (Week 1)
- [ ] Next.js 프로젝트 초기화
- [ ] `docker-compose.yml` 작성 및 PostgreSQL 컨테이너 실행 확인
- [ ] `.env.local` 환경변수 설정 (DATABASE_URL 등)
- [ ] Prisma 초기화 및 스키마 정의
- [ ] `prisma migrate dev`로 DB 마이그레이션 실행
- [ ] `prisma db seed`로 관리자 초기 계정 생성
- [ ] NextAuth.js 관리자 인증 구현

### Phase 2 — 핵심 기능 구현 (Week 2)
- [ ] 익명 건의 제출 페이지 및 API
- [ ] 추적 코드 발급 로직
- [ ] 관리자 대시보드 (목록/상세)
- [ ] 상태 관리 및 답변 작성 기능

### Phase 3 — 마무리 (Week 3)
- [ ] 건의 추적 조회 페이지
- [ ] 공개 건의 게시판
- [ ] UI/UX 개선 및 모바일 대응
- [ ] 보안 점검 (익명성 검증)
- [ ] 로컬 통합 테스트

---

## 7. 리스크 및 제약사항

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 스팸/악의적 건의 | 중 | Rate limiting (IP별 제한), 욕설 필터 검토 |
| 익명성 우회 가능성 | 고 | 서버 로그에도 IP 미기록 정책 수립 |
| 관리자 계정 탈취 | 고 | 강력한 비밀번호 정책, 2FA 추후 도입 |
| 추적 코드 분실 | 저 | UX에서 코드 저장 강조, 재발급 불가 명시 |

---

## 8. 참고 사항

- 본 건의함은 **내부 전용**으로 외부 공개 URL에 노출되지 않도록 설정
- 추적 코드는 **1회만 표시**되므로 UX에서 복사 버튼 및 경고 문구 필수
- 관리자 계정은 초기에 시드 데이터로 생성하고 이후 관리자 페이지에서 추가 가능
