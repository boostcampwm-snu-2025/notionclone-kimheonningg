import type { CSSProperties, FormEvent, MouseEvent } from "react";
import { Search, Menu } from "@mui/icons-material";

import { USER_NAME } from "../../constants/userName";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const searchStyles: Record<string, CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.15)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 24,
    boxSizing: "border-box",
    zIndex: 1000,
  },
  panel: {
    width: "100%",
    maxWidth: 980,
    height: "calc(100vh - 48px)",
    background: "var(--gray-50)",
    borderRadius: 18,
    boxShadow: "0 18px 40px rgba(15, 15, 15, 0.18)",
    border: "1px solid var(--gray-200)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "12px 18px",
    borderBottom: "1px solid rgba(0,0,0,0.03)",
  },
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--gray-500)",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 15,
    color: "var(--gray-900)",
  },
  inputPlaceholder: {
    color: "var(--gray-400)",
  },
  rightIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    border: "1px solid var(--gray-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--gray-500)",
    background: "white",
    flexShrink: 0,
  },
  body: {
    flex: 1,
    background: "#fff",
  },
};

const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  if (!open) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div style={searchStyles.backdrop} onClick={handleBackdropClick}>
      <div style={searchStyles.panel}>
        <header style={searchStyles.header}>
          <form style={searchStyles.searchRow} onSubmit={handleSubmit}>
            <div style={searchStyles.searchIcon}>
              <Search fontSize="small" />
            </div>
            <input
              autoFocus
              style={searchStyles.input}
              placeholder={`${USER_NAME}님의 워크스페이스에서 검색 또는 질문`}
            />
            <div style={searchStyles.rightIconWrap}>
              <Menu fontSize="small" />
            </div>
          </form>
        </header>
        <div style={searchStyles.body} />
        {/* TODO */}
      </div>
    </div>
  );
};

export default SearchOverlay;
