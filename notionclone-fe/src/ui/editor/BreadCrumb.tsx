import type { CSSProperties } from "react";

import type { BreadcrumbItem } from "../../types/page";

interface BreadCrumbProps {
  items: BreadcrumbItem[];
  onItemClick?: (id: string) => void;
}

const breadcrumbStyles: Record<string, CSSProperties> = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
    color: "var(--gray-500)",
    marginBottom: 36,
  },
  button: {
    border: "none",
    background: "transparent",
    padding: 0,
    margin: 0,
    font: "inherit",
    color: "inherit",
    cursor: "pointer",
  },
  current: {
    color: "var(--gray-800)",
    fontWeight: 600,
    cursor: "default",
  },
  separator: {
    color: "var(--gray-400)",
  },
};

const BreadCrumb = ({ items, onItemClick }: BreadCrumbProps) => {
  if (!items || items.length === 0) return null;

  const lastIndex = items.length - 1;

  return (
    <div style={breadcrumbStyles.row}>
      {items.map((item, index) => {
        const isCurrent = index === lastIndex;
        const clickable = !isCurrent && !!onItemClick;

        return (
          <span key={item.id} style={{ display: "inline-flex", gap: 6 }}>
            {clickable ? (
              <button
                type="button"
                style={breadcrumbStyles.button}
                onClick={() => onItemClick && onItemClick(item.id)}
              >
                {item.title}
              </button>
            ) : (
              <span style={isCurrent ? breadcrumbStyles.current : undefined}>
                {item.title}
              </span>
            )}

            {index < lastIndex && (
              <span style={breadcrumbStyles.separator}>/</span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
