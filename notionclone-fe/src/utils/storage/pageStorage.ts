import type { PageState, TempDeletedPageState } from "../../types/page";

import {
  welcomeId,
  NOTION_WELCOME_ICON,
  NOTION_WELCOME_TITLE,
  NOTION_WELCOME_CONTENT,
} from "../../constants/initialContent/notionWelcome";

import {
  PAGE_STORAGE_KEY,
  DELETED_PAGE_STORAGE_KEY,
} from "../../constants/localStorageKey";

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

  // FIXME: Initially one basic page

  return {
    pages: {
      [welcomeId]: {
        id: welcomeId,
        parentId: null,
        title: NOTION_WELCOME_TITLE,
        icon: NOTION_WELCOME_ICON,
        blocks: NOTION_WELCOME_CONTENT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    rootIds: [welcomeId],
    activeId: welcomeId,
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
