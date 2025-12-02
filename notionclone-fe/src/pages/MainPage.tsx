import { useState, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";

import { KeyboardDoubleArrowRight } from "@mui/icons-material";

import Sidebar from "../ui/sidebar/Sidebar";
import SearchOverlay from "../ui/overlay/SearchOverlay";
import TrashCanOverlay from "../ui/overlay/TrashCanOverlay";
import PageHeader from "../ui/editor/PageHeader";
import PageEditor from "../ui/editor/PageEditor";

import { usePages } from "../hooks/usePages";
import { getBreadcrumbs } from "../utils/breadCrumbs";

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
};

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Overlay open states
  const [searchOpen, setSearchOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);

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
    // Search overlay
    if (id === "search") {
      setSearchOpen(true);
      return;
    }

    // Trash overlay
    if (id === "trash") {
      setTrashOpen(true);
      return;
    }

    setActivePage(id);
  };

  const renderMainContent = (): ReactNode => {
    if (activePage) {
      // Reset initial data only when ID changes
      const initialPageData = useMemo(() => {
        return activePage;
      }, [activePage.id]);

      const breadcrumbItems = getBreadcrumbs(activePage, pages);

      return (
        <>
          <PageHeader
            title={activePage.title}
            icon={activePage.icon || "📄"}
            breadcrumbItems={breadcrumbItems}
            onBreadcrumbClick={(id) => setActivePage(id)}
          />
          <PageEditor
            // Reset editor component whenever page ID changes
            key={activePage.id}
            // Prevent re-rendering using useMemo
            page={initialPageData}
            onChangeBlocks={(blocks: any) => {
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

      {/* Overlays */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <TrashCanOverlay open={trashOpen} onClose={() => setTrashOpen(false)} />
    </div>
  );
};

export default MainPage;
