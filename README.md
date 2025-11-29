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
- 기본 Notion 기능들은 `blocknote` 라이브러리 사용
- `/page`로 새로운 페이지 생성하고, page 간 hierarchy 확립
  - `/page`는 `blocknote`의 기본 기능들에 없기 때문에 따로 `NewPageSlashItem.tsx`를 정의하여 custom하여 사용
  - 앞으로 custom된 기능들은 `customSlashItems/`에 정의 예정
- Page 관리 (via custom hook `usePages.ts`)
- Page hierarchy 정보를 localStorage에 저장 (`pageStorage.ts` util 함수가 관리)
- Sidebar에서도 -개인 페이지의 `+` 클릭하거나 우측 상단의 연필 이모티콘 클릭 - page 생성 가능 (Sidebar의 root page 목록은 동적으로 렌더링된다)
- 휴지통 (기능 없이 UI만 구현- `TrashCanOverlay.tsx`)
- Sidebar의 개별 페이지 탭에서 페이지 삭제하거나 해당 페이지의 하위 (Child) 페이지 생성 가능
