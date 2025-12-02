import type { PartialBlock } from "@blocknote/core";

export const welcomeId = "welcome";

export const NOTION_WELCOME_ICON = "👋";

export const NOTION_WELCOME_TITLE = "Notion에 오신 것을 환영합니다!";

export const NOTION_WELCOME_CONTENT: PartialBlock[] = [
  {
    type: "paragraph",
    content: [
      {
        type: "text",
        text: "Notion 계정을 만들어 보세요.",
        styles: {},
      },
    ],
  },
  {
    type: "bulletListItem",
    content: [
      { type: "text", text: "아무 곳이나 클릭해 ", styles: {} },
      { type: "text", text: "/", styles: { code: true } },
      {
        type: "text",
        text: " 를 입력하고 제목, 표, 할 일 목록 등 추가할 수 있는 항목을 확인해 보세요.",
        styles: {},
      },
    ],
  },
  {
    type: "bulletListItem",
    content: [
      { type: "text", text: "/페이지 ", styles: { bold: true } },
      {
        type: "text",
        text: "를 입력해 새 페이지를 추가하고 하위 페이지를 자유롭게 만들어 보세요.",
        styles: {},
      },
    ],
  },
  {
    type: "bulletListItem",
    content: [
      {
        type: "text",
        text: "왼쪽 사이드바에서 새 페이지를 찾고, 정리하고, 추가하세요.",
        styles: {},
      },
    ],
  },
  {
    type: "toggleListItem",
    content: [
      {
        type: "text",
        text: "이것은 토글 블록입니다. 작은 삼각형을 클릭하면 유용한 팁을 더 확인할 수 있어요!",
        styles: {},
      },
    ],
    children: [
      {
        type: "bulletListItem",
        content: [
          {
            type: "text",
            text: "화면 왼쪽 하단의 ?를 클릭해 가이드, 튜토리얼 등을 확인하고 나의 디지털 공간을 필요에 맞게 구성해 보세요.",
            styles: {},
          },
        ],
      },
      {
        type: "bulletListItem",
        content: [
          {
            type: "text",
            text: "사이드바에서 마켓플레이스를 클릭해 커뮤니티에서 제작한 다양한 템플릿을 사용해 보세요.",
            styles: {},
          },
        ],
      },
    ],
  },
];
