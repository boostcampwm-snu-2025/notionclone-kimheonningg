import {
  useState,
  useEffect,
  useMemo,
  type CSSProperties,
  type MouseEvent,
} from "react";
import {
  Search,
  DescriptionOutlined,
  SubdirectoryArrowLeft,
} from "@mui/icons-material";

import { USER_NAME } from "../../constants/userName";
import { NO_TITLE_PAGE_TITLE } from "../../constants/page";

import { loadInitialPageState } from "../../utils/storage/pageStorage";
import type { Page } from "../../types/page";
import { formatDate } from "../../utils/date";
import { extractTextFromBlocks } from "../../utils/blocks";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onNavigate?: (pageId: string) => void;
}

const searchOverlayStyles: Record<string, CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "8vh",
    boxSizing: "border-box",
    zIndex: 1500,
  },
  panel: {
    width: "100%",
    maxWidth: 700,
    height: "60vh",
    maxHeight: 600,
    background: "var(--white)",
    borderRadius: 12,
    boxShadow: "0 12px 48px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "16px 16px 12px",
    borderBottom: "1px solid var(--gray-200)",
  },
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  searchIcon: {
    display: "flex",
    alignItems: "center",
    color: "var(--gray-500)",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 16,
    color: "var(--gray-900)",
    padding: 0,
  },
  rightIconWrap: {
    padding: "2px 6px",
    borderRadius: 4,
    border: "1px solid var(--gray-200)",
    color: "var(--gray-500)",
    fontSize: 12,
    background: "var(--gray-50)",
    display: "flex",
    alignItems: "center",
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
    background: "var(--white)",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--gray-500)",
    padding: "12px 16px 8px",
  },
  resultItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    cursor: "pointer",
    gap: 12,
    textDecoration: "none",
    borderLeft: "3px solid transparent",
  },
  resultIconBox: {
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
    color: "var(--gray-600)",
  },
  resultContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    overflow: "hidden",
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: "var(--gray-900)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  resultMeta: {
    fontSize: 12,
    color: "var(--gray-500)",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  enterIcon: {
    color: "var(--gray-400)",
    display: "none",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "var(--gray-500)",
    fontSize: 14,
    gap: 8,
  },
  footer: {
    padding: "8px 16px",
    borderTop: "1px solid var(--gray-200)",
    fontSize: 12,
    color: "var(--gray-500)",
    display: "flex",
    justifyContent: "space-between",
    background: "var(--gray-50)",
  },
};

const SearchOverlay = ({ open, onClose, onNavigate }: SearchOverlayProps) => {
  const [keyword, setKeyword] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Load page data
  useEffect(() => {
    if (open) {
      const state = loadInitialPageState();
      if (state) {
        setPages(Object.values(state.pages));
      }
      setKeyword(""); // Init search keyword
    }
  }, [open]);

  // Search logic
  const filteredPages = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return []; // No search keyword

    return pages.filter((page) => {
      const titleMatch = (page.title || "").toLowerCase().includes(trimmed);
      // Search at body
      const contentText = extractTextFromBlocks(page.blocks).toLowerCase();
      const contentMatch = contentText.includes(trimmed);

      return titleMatch || contentMatch;
    });
  }, [keyword, pages]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleItemClick = (pageId: string) => {
    if (onNavigate) {
      onNavigate(pageId);
    } else {
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div style={searchOverlayStyles.backdrop} onClick={handleBackdropClick}>
      <div style={searchOverlayStyles.panel}>
        <header style={searchOverlayStyles.header}>
          <form
            style={searchOverlayStyles.searchRow}
            onSubmit={(e) => e.preventDefault()}
          >
            <div style={searchOverlayStyles.searchIcon}>
              <Search fontSize="medium" />
            </div>
            <input
              autoFocus
              style={searchOverlayStyles.input}
              placeholder={`${USER_NAME}님의 워크스페이스에서 검색 또는 질문`}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <div style={searchOverlayStyles.rightIconWrap}>
              <span>ESC</span>
            </div>
          </form>
        </header>

        {/* Body + Search results */}
        <div style={searchOverlayStyles.body}>
          {!keyword ? (
            <div style={searchOverlayStyles.emptyState}>
              <span>검색어를 입력하여 페이지를 찾아보세요.</span>
            </div>
          ) : filteredPages.length === 0 ? (
            <div style={searchOverlayStyles.emptyState}>
              <span>'{keyword}'에 대한 검색 결과가 없습니다.</span>
            </div>
          ) : (
            <>
              <div style={searchOverlayStyles.sectionTitle}>결과 상위 일치</div>
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  style={{
                    ...searchOverlayStyles.resultItem,
                    background:
                      hoveredId === page.id ? "var(--gray-100)" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredId(page.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleItemClick(page.id)}
                >
                  <div style={searchOverlayStyles.resultIconBox}>
                    {page.icon ? (
                      page.icon
                    ) : (
                      <DescriptionOutlined fontSize="small" />
                    )}
                  </div>

                  <div style={searchOverlayStyles.resultContent}>
                    <div style={searchOverlayStyles.resultTitle}>
                      {page.title || NO_TITLE_PAGE_TITLE}
                    </div>
                    <div style={searchOverlayStyles.resultMeta}>
                      {USER_NAME} • 편집 시간: {formatDate(page.updatedAt)}
                    </div>
                  </div>

                  {hoveredId === page.id && (
                    <SubdirectoryArrowLeft
                      fontSize="small"
                      style={{
                        color: "var(--gray-400)",
                        transform: "scaleX(-1)",
                      }}
                    />
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <div style={searchOverlayStyles.footer}>
          <span>
            <b style={{ fontWeight: 600 }}>↑↓</b> 이동
            <b style={{ fontWeight: 600, marginLeft: 8 }}>Enter</b> 열기
          </span>
          <span>
            AI로 모든 출처 검색 <b>New</b>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
