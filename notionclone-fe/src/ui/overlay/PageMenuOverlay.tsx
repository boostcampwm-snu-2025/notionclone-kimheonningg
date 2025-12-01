import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import {
  StarBorder,
  Link,
  ContentCopy,
  DriveFileRenameOutline,
  DriveFileMove,
  DeleteOutline,
  SyncAlt,
  OpenInNew,
  VerticalSplit,
} from "@mui/icons-material";

interface PageMenuOverlayProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onDelete: () => void;
  onRename: () => void;
  onDuplicate?: () => void;
  updatedAt?: string;
}

const pageMenuOverlayStyles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 1300,
  },
  container: {
    position: "fixed",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow:
      "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px",
    padding: "6px 0",
    minWidth: "240px",
    zIndex: 1301,
    color: "var(--gray-900)",
  },
  sectionHeader: {
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--gray-500)",
    padding: "0 12px 6px 12px",
    marginTop: "2px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.1s",
    gap: "10px",
    userSelect: "none",
  },
  menuItemHover: {
    backgroundColor: "var(--gray-100)",
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--gray-700)",
    minWidth: "20px",
  },
  label: {
    flex: 1,
    whiteSpace: "nowrap",
  },
  divider: {
    height: "1px",
    backgroundColor: "var(--gray-200)",
    margin: "4px 0",
  },
  footer: {
    marginTop: "4px",
    padding: "8px 12px 2px",
    borderTop: "1px solid var(--gray-200)",
    fontSize: "11px",
    color: "var(--gray-500)",
    lineHeight: "1.4",
  },
};

const MenuItem = ({
  icon,
  label,
  onClick,
  color,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  color?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...pageMenuOverlayStyles.menuItem,
        ...(isHovered ? pageMenuOverlayStyles.menuItemHover : {}),
        color: color || "inherit",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <div style={pageMenuOverlayStyles.iconWrapper}>{icon}</div>
      <div style={pageMenuOverlayStyles.label}>{label}</div>
    </div>
  );
};

const PageMenuOverlay = ({
  anchorEl,
  onClose,
  onDelete,
  onRename,
  onDuplicate,
  updatedAt,
}: PageMenuOverlayProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Logic to calculate positions
  useEffect(() => {
    if (anchorEl && menuRef.current) {
      const rect = anchorEl.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      let top = rect.bottom - 50;
      let left = rect.left;

      // If it goes down the screen, pull it up
      if (top + menuRect.height > windowHeight - 10) {
        top = rect.top - menuRect.height - 4;
      }

      setPosition({ top, left });
    }
  }, [anchorEl]);

  // If clicked outside the overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ignore
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (anchorEl) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl, onClose]);

  if (!anchorEl) return null;

  // date formatting
  const dateStr = updatedAt
    ? new Date(updatedAt).toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div style={pageMenuOverlayStyles.overlay}>
      <div
        ref={menuRef}
        style={{
          ...pageMenuOverlayStyles.container,
          top: position.top,
          left: position.left,
        }}
      >
        {/* Header */}
        <div style={pageMenuOverlayStyles.sectionHeader}>페이지</div>

        {/* Section 1 */}
        <MenuItem
          icon={<StarBorder fontSize="small" />}
          label="즐겨찾기에 추가"
          onClick={onClose}
        />

        <div style={pageMenuOverlayStyles.divider} />

        {/* Section 2 */}
        <MenuItem
          icon={<Link fontSize="small" />}
          label="링크 복사"
          onClick={onClose}
        />
        <MenuItem
          icon={<ContentCopy fontSize="small" />}
          label="복제"
          onClick={() => {
            if (onDuplicate) onDuplicate();
            onClose();
          }}
        />
        <MenuItem
          icon={<DriveFileRenameOutline fontSize="small" />}
          label="이름 바꾸기"
          onClick={() => {
            onRename();
            onClose();
          }}
        />
        <MenuItem
          icon={<DriveFileMove fontSize="small" />}
          label="옮기기"
          onClick={onClose}
        />
        <MenuItem
          icon={<DeleteOutline fontSize="small" />}
          label="휴지통으로 이동"
          onClick={() => {
            onDelete();
            onClose();
          }}
        />

        <div style={pageMenuOverlayStyles.divider} />

        {/* Section 3 */}
        <MenuItem
          icon={<SyncAlt fontSize="small" />}
          label="위키로 전환"
          onClick={onClose}
        />

        <div style={pageMenuOverlayStyles.divider} />

        {/* Section 4 */}
        <MenuItem
          icon={<OpenInNew fontSize="small" />}
          label="새 탭에서 열기"
          onClick={onClose}
        />
        <MenuItem
          icon={<VerticalSplit fontSize="small" />}
          label="사이드 보기에서 열기"
          onClick={onClose}
        />

        <div style={pageMenuOverlayStyles.divider} />

        {/* Footer */}
        <div style={pageMenuOverlayStyles.footer}>
          <div>김희원 최종 편집</div>
          {dateStr && <div>{dateStr}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageMenuOverlay;
