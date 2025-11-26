import { useState } from "react";
import type { CSSProperties } from "react";

import { KeyboardDoubleArrowRight } from "@mui/icons-material";

import Sidebar from "../ui/sidebar/Sidebar";
import SearchOverlay from "../ui/search/SearchOverlay";
import NotionWelcomePage from "../ui/editor/NotionWelcomePage";

const mainPageStyles: Record<string, CSSProperties> = {
  wrap: {
    display: "flex",
    height: "100vh",
  },
  collapsedButton: {
    position: "fixed",
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "1px solid var(--gray-300)",
    background: "var(--gray-100)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
  },
  content: {
    flex: 1,
    background: "var(--gray-50)",
    overflowY: "auto",
  },
};

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string | undefined>("home");
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSidebarItemClick = (id: string) => {
    setActiveId(id);

    if (id === "search") {
      setSearchOpen(true);
    }
  };

  return (
    <div style={mainPageStyles.wrap}>
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeId={activeId}
        onItemClick={handleSidebarItemClick}
      />
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={mainPageStyles.collapsedButton}
        >
          <KeyboardDoubleArrowRight fontSize="small" />
        </button>
      )}

      {/* Main Content */}
      <div style={mainPageStyles.content}>
        <NotionWelcomePage />
      </div>

      {/* SearchOverlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default MainPage;
