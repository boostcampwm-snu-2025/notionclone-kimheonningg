import type { PageState, Page, TempDeletedPageState } from "../../types/page";

import {
  NOTION_WELCOME_ID,
  NOTION_WELCOME_ICON,
  NOTION_WELCOME_TITLE,
  NOTION_WELCOME_CONTENT,
} from "../../constants/initialContent/notionWelcome";

import {
  PAGE_STORAGE_KEY,
  DELETED_PAGE_STORAGE_KEY,
} from "../../constants/localStorageKey";

import { DEFAULT_PAGE_ICON } from "../../constants/page";

export const loadInitialPageState = (): PageState => {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(PAGE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PageState;
        return parsed;
      }
    } catch (error) {
      console.warn("Failed to load pages from storage", error);
    }
  }

  return {
    pages: {
      [NOTION_WELCOME_ID]: {
        id: NOTION_WELCOME_ID,
        parentId: null,
        title: NOTION_WELCOME_TITLE,
        icon: NOTION_WELCOME_ICON,
        blocks: NOTION_WELCOME_CONTENT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    rootIds: [NOTION_WELCOME_ID],
    activeId: NOTION_WELCOME_ID,
  };
};

export const savePageState = (state: PageState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save pages to storage", error);
  }
};

export const loadTempDeletedPageState = (): TempDeletedPageState => {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(DELETED_PAGE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TempDeletedPageState;
        return parsed;
      }
    } catch (error) {
      console.warn("Failed to load deleted pages from storage", error);
    }
  }

  return { tempDeletedPages: {} };
};

export const saveTempDeletedPageState = (
  deletedState: TempDeletedPageState
) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      DELETED_PAGE_STORAGE_KEY,
      JSON.stringify(deletedState)
    );
  } catch (error) {
    console.warn("Failed to save deleted pages", error);
  }
};

export const createChildPageWithBlocks = (title: string, blocks: any[]) => {
  const state = loadInitialPageState();
  if (!state || !state.activeId) return;

  const newPageId = crypto.randomUUID();
  const now = new Date().toISOString();

  const newPage: Page = {
    id: newPageId,
    parentId: state.activeId, // Current page will be the parent
    title: title,
    icon: DEFAULT_PAGE_ICON,
    blocks: blocks,
    createdAt: now,
    updatedAt: now,
  };

  // Update state
  state.pages[newPageId] = newPage;

  savePageState(state);

  // Move to generated page
  state.activeId = newPageId;
  savePageState(state);
};
