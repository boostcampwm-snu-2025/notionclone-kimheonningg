import type { CSSProperties, ChangeEvent } from "react";

import type { BreadcrumbItem } from "../../types/page";
import BreadCrumb from "./BreadCrumb";
import IconSelector from "./common/IconSelector";

import { NO_TITLE_PAGE_TITLE } from "../../constants/page";
import { NOTION_WELCOME_ICON } from "../../constants/initialContent/notionWelcome";

interface PageHeaderProps {
  title: string;
  icon?: string;
  breadcrumbItems: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
  onTitleChange: (newTitle: string) => void;
  onIconChange: (newIcon: string) => void;
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
  titleInput: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.2,
    color: "var(--gray-900)",
    margin: "0 0 12px",
    width: "100%",
    border: "none",
    background: "none",
    outline: "none",
    padding: 0,
    fontFamily: "inherit",
  },
};

const PageHeader = ({
  title,
  icon = NOTION_WELCOME_ICON,
  breadcrumbItems,
  onBreadcrumbClick,
  onTitleChange,
  onIconChange,
}: PageHeaderProps) => {
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  return (
    <header style={pageHeaderStyles.wrap}>
      <div style={pageHeaderStyles.breadcrumbRow}>
        <BreadCrumb items={breadcrumbItems} onItemClick={onBreadcrumbClick} />
      </div>

      <div style={pageHeaderStyles.emojiRow}>
        <IconSelector icon={icon} onIconChange={onIconChange} />
      </div>

      <input
        style={pageHeaderStyles.titleInput}
        value={title}
        onChange={handleTitleChange}
        placeholder={NO_TITLE_PAGE_TITLE}
      />
    </header>
  );
};

export default PageHeader;
