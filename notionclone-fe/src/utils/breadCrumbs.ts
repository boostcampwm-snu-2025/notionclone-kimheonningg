import type { Page, BreadcrumbItem } from "../types/page";

import { NO_TITLE_PAGE_TITLE } from "../constants/page";

export const getBreadcrumbs = (
  startPage: Page | null,
  allPages: Record<string, Page>
): BreadcrumbItem[] => {
  if (!startPage) return [];

  const path: BreadcrumbItem[] = [];
  let current: Page | null | undefined = startPage;

  while (current) {
    // In [Root, Parent, Current] order- shift at front
    path.unshift({
      id: current.id,
      title: current.title || NO_TITLE_PAGE_TITLE,
    });

    // Move to parent page
    if (current.parentId) {
      current = allPages[current.parentId];
    } else {
      current = null; // Root
    }
  }

  return path;
};
