import { useEffect, useMemo, useState } from "react";
import type { PartialBlock } from "@blocknote/core";

import type { Page, PageState } from "../types/page";
import {
  loadInitialPageState,
  savePageState,
  loadTempDeletedPageState,
  saveTempDeletedPageState,
} from "../utils/storage/pageStorage";

import { NO_TITLE_PAGE_TITLE } from "../constants/page";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `page_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const getDescendantIds = (
  pages: Record<string, Page>,
  parentId: string
): string[] => {
  const children = Object.values(pages).filter(
    (page) => page.parentId === parentId
  );
  return children.reduce(
    (accumulator, child) => [
      ...accumulator,
      child.id,
      ...getDescendantIds(pages, child.id),
    ],
    [] as string[]
  );
};

const getTempDescendantIds = (
  tempPages: Record<string, Page>,
  parentId: string
): string[] => {
  const children = Object.values(tempPages).filter(
    (page) => page.parentId === parentId
  );
  return children.reduce(
    (accumulator, child) => [
      ...accumulator,
      child.id,
      ...getTempDescendantIds(tempPages, child.id),
    ],
    [] as string[]
  );
};

export const usePages = () => {
  const [state, setState] = useState<PageState>(() => loadInitialPageState());

  // Save at localStorage whenever state changes
  useEffect(() => {
    savePageState(state);
  }, [state]);

  const activePage: Page | null = useMemo(() => {
    if (!state.activeId) return null;
    return state.pages[state.activeId] ?? null;
  }, [state]);

  const setActivePage = (id: string) => {
    setState((prev) =>
      prev.activeId === id ? prev : { ...prev, activeId: id }
    );
  };

  const createPage = (
    parentId: string | null,
    options?: { title?: string; icon?: string; initialBlocks?: PartialBlock[] }
  ): string => {
    const id = createId();

    const page: Page = {
      id,
      parentId,
      title: options?.title ?? NO_TITLE_PAGE_TITLE,
      icon: options?.icon,
      blocks: options?.initialBlocks ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState((prev) => {
      const pages = { ...prev.pages, [id]: page };
      const rootIds = parentId === null ? [...prev.rootIds, id] : prev.rootIds;

      return { ...prev, pages, rootIds, activeId: id };
    });

    return id;
  };

  // Temporary delete to trash can
  const tempDeletePage = (id: string) => {
    setState((prev) => {
      const idsToDelete = [id, ...getDescendantIds(prev.pages, id)];

      const pagesToMove: Record<string, Page> = {};
      idsToDelete.forEach((delId) => {
        const page = prev.pages[delId];
        if (page) {
          pagesToMove[delId] = page;
        }
      });

      try {
        const deletedState = loadTempDeletedPageState();
        const nextDeletedPages = {
          ...deletedState.tempDeletedPages,
          ...pagesToMove,
        };
        saveTempDeletedPageState({ tempDeletedPages: nextDeletedPages });
      } catch (error) {
        console.warn("Failed to move pages into deleted storage", error);
      }

      // Remove from original pages
      const nextPages = { ...prev.pages };
      idsToDelete.forEach((delId) => {
        delete nextPages[delId];
      });

      const nextRootIds = prev.rootIds.filter(
        (rootId) => !idsToDelete.includes(rootId)
      );

      let nextActiveId = prev.activeId;
      if (nextActiveId && idsToDelete.includes(nextActiveId)) {
        nextActiveId = nextRootIds.length > 0 ? nextRootIds[0] : null;
      }

      return {
        pages: nextPages,
        rootIds: nextRootIds,
        activeId: nextActiveId,
      };
    });
  };

  // Restore from trash can
  const restoreTempDeletedPage = (id: string) => {
    setState((prev) => {
      const deletedState = loadTempDeletedPageState();
      const allDeleted = deletedState.tempDeletedPages || {};

      if (!allDeleted[id]) return prev;

      const idsToRestore = [id, ...getTempDescendantIds(allDeleted, id)];

      const restoredPages: Record<string, Page> = {};
      idsToRestore.forEach((restoreId) => {
        const page = allDeleted[restoreId];
        if (page) restoredPages[restoreId] = page;
      });

      // Remove from temp storage
      const remainingDeleted = { ...allDeleted };
      idsToRestore.forEach((restoreId) => {
        delete remainingDeleted[restoreId];
      });
      saveTempDeletedPageState({ tempDeletedPages: remainingDeleted });

      // Restore to main page
      const nextPages: Record<string, Page> = {
        ...prev.pages,
        ...restoredPages,
      };
      let nextRootIds = [...prev.rootIds];

      idsToRestore.forEach((restoreId) => {
        const page = restoredPages[restoreId];
        if (!page) return;

        const parentId = page.parentId;
        const parentInNextPages =
          parentId != null ? !!nextPages[parentId] : false;
        const parentAlsoRestored =
          parentId != null ? idsToRestore.includes(parentId) : false;

        // No parent-> make as root hierarchy
        if (parentId === null || (!parentInNextPages && !parentAlsoRestored)) {
          if (!nextRootIds.includes(restoreId)) {
            nextRootIds.push(restoreId);
          }
          if (parentId !== null && !parentInNextPages && !parentAlsoRestored) {
            nextPages[restoreId] = { ...page, parentId: null };
          }
        }
      });

      let nextActiveId = prev.activeId;
      if (!nextActiveId) {
        nextActiveId = nextRootIds[0] ?? null;
      } else if (!nextPages[nextActiveId]) {
        nextActiveId = nextRootIds[0] ?? null;
      }

      return {
        pages: nextPages,
        rootIds: nextRootIds,
        activeId: nextActiveId,
      };
    });
  };

  // Permanent deletion
  const permanentlyDeletePage = (id: string) => {
    setState((prev) => {
      let nextPages = { ...prev.pages };
      let nextRootIds = [...prev.rootIds];
      let nextActiveId = prev.activeId;

      // Delete from main page (if any)
      if (nextPages[id]) {
        const idsToDelete = [id, ...getDescendantIds(nextPages, id)];

        idsToDelete.forEach((delId) => {
          delete nextPages[delId];
        });

        nextRootIds = nextRootIds.filter(
          (rootId) => !idsToDelete.includes(rootId)
        );

        if (nextActiveId && idsToDelete.includes(nextActiveId)) {
          nextActiveId = nextRootIds.length > 0 ? nextRootIds[0] : null;
        }
      }

      // Delete from trash can (temp delete) (if any)
      try {
        const deletedState = loadTempDeletedPageState();
        const allDeleted = deletedState.tempDeletedPages || {};

        if (allDeleted[id]) {
          const idsToDeleteTrash = [
            id,
            ...getTempDescendantIds(allDeleted, id),
          ];
          const nextDeleted = { ...allDeleted };
          idsToDeleteTrash.forEach((restoreId) => {
            delete nextDeleted[restoreId];
          });
          saveTempDeletedPageState({ tempDeletedPages: nextDeleted });
        }
      } catch (error) {
        console.warn("Failed to permanently delete pages", error);
      }

      return {
        pages: nextPages,
        rootIds: nextRootIds,
        activeId: nextActiveId,
      };
    });
  };

  const renamePageTitle = (id: string, title: string) => {
    setState((prev) => {
      const target = prev.pages[id];
      if (!target) return prev;
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [id]: { ...target, title, updatedAt: new Date().toISOString() },
        },
      };
    });
  };

  const modifyPageIcon = (id: string, icon: string) => {
    setState((prev) => {
      const target = prev.pages[id];
      if (!target) return prev;
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [id]: { ...target, icon, updatedAt: new Date().toISOString() },
        },
      };
    });
  };

  const updatePageBlocks = (id: string, blocks: PartialBlock[]) => {
    setState((prev) => {
      const target = prev.pages[id];
      if (!target) return prev;

      const updated: Page = {
        ...target,
        blocks,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        pages: {
          ...prev.pages,
          [id]: updated,
        },
      };
    });
  };

  const getChildren = (parentId: string | null): Page[] => {
    return Object.values(state.pages)
      .filter((page) => page.parentId === parentId)
      .sort(
        (a, b) => state.rootIds.indexOf(a.id) - state.rootIds.indexOf(b.id)
      );
  };

  return {
    state,
    pages: state.pages,
    rootIds: state.rootIds,
    activePageId: state.activeId,
    activePage,
    setActivePage,
    createPage,
    tempDeletePage,
    restoreTempDeletedPage,
    permanentlyDeletePage,
    renamePageTitle,
    modifyPageIcon,
    updatePageBlocks,
    getChildren,
  };
};
