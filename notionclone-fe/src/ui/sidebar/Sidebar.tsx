import type { CSSProperties } from "react";

import {
  KeyboardDoubleArrowLeft,
  EditOutlined,
  HelpOutline,
  Inventory2Outlined,
  DescriptionOutlined,
  Add,
} from "@mui/icons-material";

import type { Page } from "../../types/page";
import { SIDEBAR_SECTIONS } from "../../constants/sidebar";
import SidebarItemRow from "./SidebarItemRow";
import HoverIconButton from "./HoverIconButton";

import { USER_NAME } from "../../constants/userName";
import { NO_TITLE_PAGE_TITLE } from "../../constants/page";

// constant to disabled un-implemented rows, remove later
const IMPLEMENTED_IDS = ["search", "trash"];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeId?: string;
  onItemClick?: (id: string) => void;
  // Props for actual page data
  pages: Record<string, Page>;
  rootIds: string[];
  onCreatePage: () => void;
}

const sidebarStyles: Record<string, CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    width: 300,
    height: "100vh",
    padding: "12px 0 12px 0",
    background: "var(--gray-100)",
    borderRight: "1px solid var(--gray-300)",
    fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    fontSize: 14,
    color: "var(--gray-700)",
    boxSizing: "border-box",
    overflow: "hidden",
    transition:
      "width 0.2s ease-out, padding 0.2s ease-out, border-right 0.2s ease-out",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto", // Allow vertical scroll
    overflowX: "hidden",
    padding: "0 10px 0 12px",
  },
  workspace: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 16px 14px 12px",
    marginBottom: 4,
    flexShrink: 0,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 6,
    background: "var(--gray-900)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  workspaceMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 0,
  },
  workspaceName: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--gray-900)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  workspaceSub: {
    fontSize: 11,
    color: "var(--gray-500)",
  },
  workspaceActions: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "var(--gray-500)",
  },
  section: { marginTop: 8 },
  sectionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabel: {
    padding: "12px 6px 4px",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--gray-500)",
  },
  itemList: { listStyle: "none", padding: 0, margin: 0 },
  bottom: {
    padding: "12px 10px 0 12px",
    borderTop: "1px solid var(--gray-300)",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "var(--gray-500)",
    flexShrink: 0,
  },
  bottomIcon: {
    width: 22,
    height: 22,
    borderRadius: 999,
    border: "1px solid var(--gray-300)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const Sidebar = ({
  collapsed,
  onToggle,
  activeId,
  onItemClick,
  pages,
  rootIds,
  onCreatePage,
}: SidebarProps) => {
  return (
    <aside
      style={{
        ...sidebarStyles.wrap,
        width: collapsed ? 0 : 300,
        borderRight: collapsed ? "none" : "1px solid var(--gray-300)",
      }}
    >
      {!collapsed && (
        <>
          <header style={sidebarStyles.workspace}>
            <div style={sidebarStyles.avatar}>김</div>

            <div style={sidebarStyles.workspaceMain}>
              <div style={sidebarStyles.workspaceName}>
                {`${USER_NAME}님의 워크스페이스`}
              </div>
              <div style={sidebarStyles.workspaceSub}>개인 · 무료 플랜</div>
            </div>

            <div style={sidebarStyles.workspaceActions}>
              <HoverIconButton
                icon={<KeyboardDoubleArrowLeft fontSize="small" />}
                label="사이드바 닫기"
                onClick={onToggle}
              />
              <HoverIconButton
                icon={<EditOutlined fontSize="small" />}
                label="새 빈 페이지를 만들기"
                onClick={onCreatePage}
              />
            </div>
          </header>

          <div style={sidebarStyles.scrollArea}>
            {SIDEBAR_SECTIONS.map((section) => (
              <section key={section.id} style={sidebarStyles.section}>
                {section.label && (
                  <div style={sidebarStyles.sectionRow}>
                    <span style={sidebarStyles.sectionLabel}>
                      {section.label}
                    </span>
                    {section.id === "personal" && (
                      <HoverIconButton
                        icon={<Add sx={{ fontSize: 16 }} />}
                        label="페이지 추가"
                        onClick={onCreatePage}
                        noBorder={true}
                      />
                    )}
                  </div>
                )}

                <ul style={sidebarStyles.itemList}>
                  {/* Static item rendering */}
                  {section.items.map((item) => {
                    const isImplemented = IMPLEMENTED_IDS.includes(item.id);

                    return (
                      <SidebarItemRow
                        key={item.id}
                        item={item}
                        isActive={activeId === item.id}
                        onClick={
                          // no onclick function -> deactivates SidebarItemRow
                          isImplemented && onItemClick
                            ? () => onItemClick(item.id)
                            : undefined
                        }
                      />
                    );
                  })}

                  {/* Dynamic item rendering */}
                  {section.id === "personal" &&
                    rootIds.map((id) => {
                      const page = pages[id];
                      if (!page) return null;

                      return (
                        <SidebarItemRow
                          key={page.id}
                          item={{
                            id: page.id,
                            label: page.title || NO_TITLE_PAGE_TITLE,
                            icon: page.icon ? (
                              <span>{page.icon}</span>
                            ) : (
                              <DescriptionOutlined fontSize="small" />
                            ),
                          }}
                          isActive={activeId === page.id}
                          onClick={
                            onItemClick ? () => onItemClick(page.id) : undefined
                          }
                          // TODO
                          onAddChildPage={() => {}}
                          onOpenDeleteMenu={() => {}}
                        />
                      );
                    })}
                </ul>
              </section>
            ))}
          </div>

          <div style={sidebarStyles.bottom}>
            <div style={sidebarStyles.bottomIcon}>
              <HelpOutline fontSize="small" />
            </div>
            <div style={sidebarStyles.bottomIcon}>
              <Inventory2Outlined fontSize="small" />
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
