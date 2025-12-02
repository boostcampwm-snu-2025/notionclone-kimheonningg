import type { ReactNode } from "react";

export type SidebarItemType = "link" | "sectionTitle";

export interface SidebarItem {
  id: string;
  type?: SidebarItemType; // default: "link"
  label: string;
  icon?: ReactNode;
  badge?: string;
}

export interface SidebarSection {
  id: string;
  label?: string; // Section title
  items: SidebarItem[];
}
