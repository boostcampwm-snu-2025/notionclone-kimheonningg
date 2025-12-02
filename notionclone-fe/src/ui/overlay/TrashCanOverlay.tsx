import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import {
  DeleteOutline,
  HelpOutline,
  KeyboardArrowDown,
  PersonOutline,
  DescriptionOutlined,
  BusinessOutlined,
} from "@mui/icons-material";

interface TrashCanOverlayProps {
  open: boolean;
  onClose: () => void;
}

const trashCanOverlayStyles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.4)",
    zIndex: 1300,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "10vh",
  },
  modal: {
    width: 600,
    maxWidth: "90%",
    background: "white",
    borderRadius: 8,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: 400,
    position: "relative",
  },
  header: {
    padding: "16px 16px 8px",
    borderBottom: "1px solid transparent",
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 16,
    border: "1px solid var(--gray-300)",
    borderRadius: 4,
    background: "var(--gray-100)",
    outline: "none",
    boxSizing: "border-box",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    padding: "0 16px 12px",
  },
  filterButton: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 8px",
    borderRadius: 4,
    border: "none",
    background: "transparent",
    fontSize: 13,
    color: "var(--gray-600)",
    cursor: "pointer",
  },
  activeFilter: {
    background: "var(--blue-100)",
    color: "var(--blue-600)",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--gray-800)",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    color: "var(--gray-400)",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 600,
  },
  footer: {
    padding: "10px 16px",
    background: "var(--gray-100)",
    borderTop: "1px solid var(--gray-200)",
    fontSize: 12,
    color: "var(--gray-600)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
};

const TrashCanOverlay = ({ open, onClose }: TrashCanOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={trashCanOverlayStyles.overlay}
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div style={trashCanOverlayStyles.modal}>
        <div style={trashCanOverlayStyles.header}>
          <input
            type="text"
            placeholder="휴지통에서 페이지 검색"
            style={trashCanOverlayStyles.searchInput}
            autoFocus
          />
        </div>

        <div style={trashCanOverlayStyles.filterRow}>
          <button
            type="button"
            style={{
              ...trashCanOverlayStyles.filterButton,
              background: "var(--blue-50)",
              color: "var(--blue-600)",
            }}
          >
            <PersonOutline style={{ fontSize: 16 }} />
            최종 편집자
            <KeyboardArrowDown style={{ fontSize: 16 }} />
          </button>
          <button type="button" style={trashCanOverlayStyles.filterButton}>
            <DescriptionOutlined style={{ fontSize: 16 }} />
            검색 범위:
            <KeyboardArrowDown style={{ fontSize: 16 }} />
          </button>
          <button type="button" style={trashCanOverlayStyles.filterButton}>
            <BusinessOutlined style={{ fontSize: 16 }} />
            팀스페이스
            <KeyboardArrowDown style={{ fontSize: 16 }} />
          </button>
        </div>

        <div style={trashCanOverlayStyles.content}>
          <DeleteOutline style={trashCanOverlayStyles.emptyIcon} />
          <div style={trashCanOverlayStyles.emptyText}>표시할 결과 없음</div>
        </div>

        <div style={trashCanOverlayStyles.footer}>
          <span>휴지통에 30일 이상 보관된 페이지는 자동으로 삭제됩니다.</span>
          <HelpOutline style={{ fontSize: 16, cursor: "pointer" }} />
        </div>
      </div>
    </div>
  );
};

export default TrashCanOverlay;
