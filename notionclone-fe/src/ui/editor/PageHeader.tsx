import type { CSSProperties } from "react";

import type { BreadcrumbItem } from "../../types/page";
import BreadCrumb from "./BreadCrumb";

import { NOTION_WELCOME_ICON } from "../../constants/initialContent/notionWelcome";

interface PageHeaderProps {
  title: string;
  icon?: string;
  breadcrumbItems: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
}

const pageHeaderStyles: Record<string, CSSProperties> = {
  wrap: {
    padding: "48px 80px 24px",
  },
  breadcrumbRow: {
    marginBottom: 16,
  },
  emojiRow: {
    fontSize: 56,
    lineHeight: 1,
    marginBottom: 12,
  },
  actionRow: {
    display: "flex",
    gap: 8,
    marginBottom: 14,
    fontSize: 13,
    color: "var(--gray-500)",
  },
  actionButton: {
    padding: "4px 10px",
    borderRadius: 6,
    border: "1px solid var(--gray-300)",
    background: "var(--gray-100)",
    cursor: "pointer",
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.2,
    color: "var(--gray-900)",
    margin: "0 0 12px",
  },
};

const PageHeader = ({
  title,
  icon = NOTION_WELCOME_ICON,
  breadcrumbItems,
  onBreadcrumbClick,
}: PageHeaderProps) => {
  return (
    <header style={pageHeaderStyles.wrap}>
      <div style={pageHeaderStyles.breadcrumbRow}>
        <BreadCrumb items={breadcrumbItems} onItemClick={onBreadcrumbClick} />
      </div>

      <div style={pageHeaderStyles.emojiRow}>{icon}</div>

      {/* <div style={pageHeaderStyles.actionRow}>
        <button type="button" style={pageHeaderStyles.actionButton}>
          커버 추가
        </button>
        <button type="button" style={pageHeaderStyles.actionButton}>
          댓글 추가
        </button>
      </div> */}

      <h1 style={pageHeaderStyles.title}>{title}</h1>
    </header>
  );
};

export default PageHeader;
