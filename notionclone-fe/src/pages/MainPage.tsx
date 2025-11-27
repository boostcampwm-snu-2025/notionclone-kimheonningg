import { useState, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";

import { KeyboardDoubleArrowRight } from "@mui/icons-material";

import Sidebar from "../ui/sidebar/Sidebar";
import SearchOverlay from "../ui/search/SearchOverlay";
import PageHeader from "../ui/editor/PageHeader";
import PageEditor from "../ui/editor/PageEditor";

import { usePages } from "../hooks/usePages";

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
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
  },
  content: {
    flex: 1,
    overflowY: "auto",
    background: "white",
  },
  contentInner: {
    maxWidth: 1200,
    margin: "0 auto",
    paddingBottom: 80,
  },
  placeholder: {
    padding: "80px 80px",
    color: "var(--gray-500)",
  },
  placeholderTitle: {
    margin: "0 0 8px",
    fontSize: 24,
    fontWeight: 600,
    color: "var(--gray-800)",
  },
  placeholderText: {
    margin: 0,
    fontSize: 14,
  },
};

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    pages,
    rootIds,
    activePage,
    activePageId,
    setActivePage,
    createPage,
    updatePageBlocks,
  } = usePages();

  const handleSidebarItemClick = (id: string) => {
    setActivePage(id);

    if (id === "search") {
      setSearchOpen(true);
    }
  };

  const renderMainContent = (): ReactNode => {
    if (activePage) {
      // Reset initial data only when ID changes
      const initialPageData = useMemo(() => {
        return activePage;
      }, [activePage.id]);

      return (
        <>
          <PageHeader title={activePage.title} icon={activePage.icon || "📄"} />
          <PageEditor
            // Reset editor component whenever page ID changes
            key={activePage.id}
            // Prevent re-rendering using useMemo
            page={initialPageData}
            onChangeBlocks={(blocks) => {
              updatePageBlocks(activePage.id, blocks);
            }}
            onCreateChildPage={() => {
              return createPage(activePage.id);
            }}
          />
        </>
      );
    } else {
      return <> {/* TODO */} </>;
    }
  };

  return (
    <div style={mainPageStyles.wrap}>
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeId={activePageId ?? undefined}
        onItemClick={handleSidebarItemClick}
        pages={pages}
        rootIds={rootIds}
        onCreatePage={() => createPage(null)}
      />
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          style={mainPageStyles.collapsedButton}
        >
          <KeyboardDoubleArrowRight fontSize="small" />
        </button>
      )}

      {/* Main Content */}
      <div style={mainPageStyles.content}>
        <div style={mainPageStyles.contentInner}>{renderMainContent()}</div>
      </div>

      {/* SearchOverlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default MainPage;
