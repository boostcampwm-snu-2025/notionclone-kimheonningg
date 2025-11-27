import type { PartialBlock } from "@blocknote/core";

export interface Page {
  id: string;
  parentId: string | null; // null if at root hierarchy
  title: string;
  icon?: string;
  blocks: PartialBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface PageState {
  pages: Record<string, Page>;
  rootIds: string[]; // "parentId === null" pages
  activeId: string | null;
}

export interface BreadcrumbItem {
  id: string;
  title: string;
}
