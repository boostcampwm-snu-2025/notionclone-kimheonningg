import {
  Search,
  Home,
  EventNote,
  AutoAwesome,
  Inbox,
  Person,
  ChecklistRtl,
  Paid,
  GroupAdd,
  Mail,
  CalendarMonth,
  Computer,
  Settings,
  Storefront,
  Delete,
} from "@mui/icons-material";

import type { SidebarSection } from "../types/sidebar";

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: "top-nav",
    items: [
      { id: "search", label: "검색", icon: <Search fontSize="small" /> },
      { id: "home", label: "홈", icon: <Home fontSize="small" /> },
      {
        id: "meeting",
        label: "회의",
        icon: <EventNote fontSize="small" />,
        badge: "New",
      },
      { id: "ai", label: "Notion AI", icon: <AutoAwesome fontSize="small" /> },
      { id: "inbox", label: "수신함", icon: <Inbox fontSize="small" /> },
    ],
  },
  {
    id: "personal",
    label: "개인 페이지",
    items: [], // Dynamically render items
  },
  {
    id: "shared",
    label: "공유된 페이지",
    items: [
      {
        id: "start-collab",
        label: "공동 작업 시작하기",
        icon: <GroupAdd fontSize="small" />,
      },
    ],
  },
  {
    id: "apps",
    label: "Notion 앱",
    items: [
      { id: "mail", label: "Notion 메일", icon: <Mail fontSize="small" /> },
      {
        id: "calendar",
        label: "Notion 캘린더",
        icon: <CalendarMonth fontSize="small" />,
      },
      {
        id: "desktop",
        label: "Notion 데스크톱",
        icon: <Computer fontSize="small" />,
      },
    ],
  },
  {
    id: "settings",
    items: [
      { id: "settings", label: "설정", icon: <Settings fontSize="small" /> },
      {
        id: "market",
        label: "마켓플레이스",
        icon: <Storefront fontSize="small" />,
      },
      { id: "trash", label: "휴지통", icon: <Delete fontSize="small" /> },
    ],
  },
];
