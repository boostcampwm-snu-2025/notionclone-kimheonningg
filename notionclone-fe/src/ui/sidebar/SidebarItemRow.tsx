import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { MoreHoriz, Add, ChevronRight, ExpandMore } from "@mui/icons-material";

import type { SidebarItem } from "../../types/sidebar";
import HoverIconButton from "./HoverIconButton";
import PageMenuOverlay from "../overlay/PageMenuOverlay";

interface SidebarItemRowProps {
  item: SidebarItem;
  isActive: boolean;
  onClick?: () => void;
  // "개인 페이지" tab
  onAddChildPage?: () => void;
  onDeletePage?: () => void;
  onRenamePage?: () => void;
  updatedAt?: string;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const rowStyles: Record<string, CSSProperties> = {
  item: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 6px",
    margin: "1px 0",
    borderRadius: 6,
    cursor: "pointer",
    color: "var(--gray-700)",
    userSelect: "none",
    minHeight: 28,
    transition: "background 0.1s ease, color 0.1s ease",
    position: "relative",
  },
  itemHover: {
    background: "var(--gray-200)",
  },
  itemActive: {
    background: "var(--gray-50)",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
    color: "var(--gray-900)",
  },
  icon: {
    width: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    flexShrink: 0,
  },
  label: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  badge: {
    padding: "0 6px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 600,
    background: "var(--pink-50)",
    color: "var(--pink-600)",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    marginLeft: 4,
  },
};

const SidebarItemRow = ({
  item,
  isActive,
  onClick,
  onAddChildPage,
  onDeletePage,
  onRenamePage,
  updatedAt,
  hasChildren,
  isExpanded,
  onToggleExpand,
}: SidebarItemRowProps) => {
  const [hover, setHover] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const isClickable = !!onClick;
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMoreClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setHover(false); // Reset hover state to false as closing the menu
  };

  const safeDelete =
    onDeletePage || (() => console.log("Delete not implemented"));
  const safeRename =
    onRenamePage || (() => console.log("Rename not implemented"));

  const showChevron = !!hasChildren && (hover || isExpanded);

  return (
    <>
      <li
        style={{
          ...rowStyles.item,
          ...(isClickable && (hover || isMenuOpen) ? rowStyles.itemHover : {}),
          ...(isActive ? rowStyles.itemActive : {}),
        }}
        onClick={isClickable ? onClick : undefined}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => !isMenuOpen && setHover(false)}
      >
        {item.icon && (
          <span
            style={rowStyles.icon}
            onClick={(e) => {
              if (!hasChildren || !onToggleExpand) return;
              e.stopPropagation();
              onToggleExpand();
            }}
          >
            {showChevron ? (
              isExpanded ? (
                <ExpandMore sx={{ fontSize: 18 }} />
              ) : (
                <ChevronRight sx={{ fontSize: 18 }} />
              )
            ) : (
              item.icon
            )}
          </span>
        )}

        <span style={rowStyles.label}>{item.label}</span>

        {item.badge && !hover && !isMenuOpen && (
          <span style={rowStyles.badge}>{item.badge}</span>
        )}

        {(hover || isMenuOpen) && (
          <div style={rowStyles.actions}>
            <div onClick={handleMoreClick}>
              <HoverIconButton
                icon={<MoreHoriz sx={{ fontSize: 16 }} />}
                label="삭제, 복제 등..."
                noBorder={true}
                active={isMenuOpen}
              />
            </div>

            {onAddChildPage && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChildPage();
                }}
              >
                <HoverIconButton
                  icon={<Add sx={{ fontSize: 16 }} />}
                  label="하위 페이지 추가"
                  noBorder={true}
                />
              </div>
            )}
          </div>
        )}
      </li>

      <PageMenuOverlay
        anchorEl={menuAnchorEl}
        onClose={handleMenuClose}
        onDelete={safeDelete}
        onRename={safeRename}
        updatedAt={updatedAt || new Date().toISOString()}
      />
    </>
  );
};

export default SidebarItemRow;
