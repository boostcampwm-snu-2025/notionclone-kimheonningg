# notionclone

전기정보공학부 김희원 개인 프로젝트

## Plan

2주차에 시험(기말고사)이 많아서 1주차에 2주차의 개발 대부분까지 하려고 합니다.. ㅠㅠ

## How to run this project

### Vite Frontend

Run the project by:

```bash
# move to the frontend project directory
cd notionclone-fe

# install dependencies if needed
npm install

# run this project
npm run dev
```

This project will open at `http://localhost:5173`

## Directory Structure

### Frontend

- `src/`
  - `constants/`
  - `hooks/`
  - `pages/`
  - `styles/`
  - `types/`
  - `ui/`
  - `utils/`
  - `main.tsx`

## Features

- Sidebar 열기 / 닫기 (`Sidebar.tsx`)
- 검색창 (기능 없이 UI만 구현- `SearchOverlay.tsx`)
- Page UI (`PageHeader.tsx` & `PageEditor.tsx`)
- 기본 페이지 (`notionWelcome.ts`)
- BreadCrumb (현재 hierarchy 상 위치 표시- `BreadCrumb.tsx`, 계산은 `breadCrumbs.ts` 함수가)
- Page 관리 (via custom hook `usePages.ts`)
- Page hierarchy 정보를 localStorage에 저장 (`pageStorage.ts` util 함수가 관리)
