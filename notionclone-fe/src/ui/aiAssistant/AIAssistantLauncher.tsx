import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import {
  EmojiEmotionsOutlined,
  Close,
  ArrowUpward,
  AutoAwesome,
  Translate,
  Search,
} from "@mui/icons-material";

import {
  chatWithPageContext,
  summarizeCurrentPage,
  translateCurrentPage,
  continueWritingPage,
} from "../../utils/aiAssistant/aiAssistant";
import type { ChatMessage } from "../../types/openai";

const aiAssistantLauncherStyles: Record<string, CSSProperties> = {
  floatingButton: {
    position: "fixed",
    right: 24,
    bottom: 24,
    width: 48,
    height: 48,
    borderRadius: 999,
    background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 1400,
    border: "none",
  },
  floatingIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--gray-800)",
  },
  panelWrap: {
    position: "fixed",
    right: 10,
    bottom: 10,
    height: 800,
    width: 420,
    maxWidth: "calc(100% - 32px)",
    maxHeight: "70vh",
    background: "white",
    borderRadius: 16,
    boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1401,
  },
  header: {
    padding: "12px 16px 8px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderBottom: "1px solid #f3f4f6",
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    background: "var(--gray-100)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--gray-900)",
  },
  headerClose: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--gray-500)",
  },
  body: {
    flex: 1,
    padding: "16px",
    fontSize: 13,
    color: "var(--gray-800)",
    overflowY: "auto",
  },
  bodyTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
  },
  suggestionList: {
    listStyle: "none",
    padding: 0,
    margin: "8px 0 12px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  suggestionItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "var(--gray-800)",
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 6,
    transition: "background 0.2s",
  },
  suggestionIcon: {
    width: 22,
    height: 22,
    borderRadius: 999,
    background: "var(--gray-100)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  messagesList: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  messageRowUser: {
    alignSelf: "flex-end",
    maxWidth: "80%",
    padding: "6px 10px",
    borderRadius: 12,
    background: "#3B82F6",
    color: "white",
    fontSize: 13,
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
  },
  messageRowAssistant: {
    alignSelf: "flex-start",
    maxWidth: "80%",
    padding: "6px 10px",
    borderRadius: 12,
    background: "var(--gray-100)",
    color: "var(--gray-900)",
    fontSize: 13,
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
  },
  loadingText: {
    fontSize: 12,
    color: "var(--gray-500)",
    marginTop: 4,
    marginLeft: 4,
  },
  inputWrapOuter: {
    borderTop: "1px solid var(--gray-200)",
    padding: "10px 14px 12px",
    background: "var(--gray-50)",
    flexShrink: 0,
  },
  inputWrap: {
    borderRadius: 12,
    border: "1px solid var(--gray-300)",
    background: "white",
    padding: "8px 10px 6px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  inputTagsRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  inputTag: {
    fontSize: 11,
    padding: "2px 6px",
    borderRadius: 999,
    background: "var(--gray-100)",
    color: "var(--gray-700)",
  },
  inputTextRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  inputText: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 13,
    padding: 0,
    background: "transparent",
  },
  sendButton: {
    width: 26,
    height: 26,
    borderRadius: 999,
    border: "none",
    background: "var(--gray-900)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
};

const AIAssistantLauncher = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // For scrolls
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setOpen((prev) => !prev);

  // actionFn: AI function to run
  // userLabel: Bubble text to show at UI
  const processAIAction = async (
    userLabel: string,
    actionFn: () => Promise<string>
  ) => {
    if (loading) return;

    setMessages((prev) => [...prev, { role: "user", content: userLabel }]);
    setLoading(true);

    try {
      const reply = await actionFn();
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI 응답을 가져오는 중 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Regular chatting
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput(""); // Init input

    await processAIAction(trimmed, () => chatWithPageContext(trimmed));
  };

  const handleSend = () => {
    void sendMessage();
  };

  // Recommended chatting handlers
  const handleContinueWriting = () => {
    void processAIAction("이어서 써줘", continueWritingPage);
  };

  const handleTranslate = () => {
    void processAIAction("이 페이지를 영어로 번역해줘", () =>
      translateCurrentPage("English")
    );
  };

  const handleSummarize = () => {
    void processAIAction("이 페이지를 요약해줘", summarizeCurrentPage);
  };

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  return (
    <>
      {!open && (
        <button
          type="button"
          style={aiAssistantLauncherStyles.floatingButton}
          onClick={handleToggle}
          aria-label="AI Assistant 열기"
        >
          <div style={aiAssistantLauncherStyles.floatingIcon}>
            <EmojiEmotionsOutlined sx={{ fontSize: 26 }} />
          </div>
        </button>
      )}

      {/* Overlay panel- show only if open */}
      {open && (
        <div style={aiAssistantLauncherStyles.panelWrap}>
          {/* header */}
          <div style={aiAssistantLauncherStyles.header}>
            <div style={aiAssistantLauncherStyles.headerAvatar}>
              <EmojiEmotionsOutlined sx={{ fontSize: 22 }} />
            </div>
            <div style={aiAssistantLauncherStyles.headerTitle}>새 AI 채팅</div>
            <button
              type="button"
              style={aiAssistantLauncherStyles.headerClose}
              onClick={handleToggle}
              aria-label="닫기"
            >
              <Close sx={{ fontSize: 18 }} />
            </button>
          </div>

          {/* body */}
          <div style={aiAssistantLauncherStyles.body}>
            {messages.length === 0 ? (
              <>
                <div style={aiAssistantLauncherStyles.bodyTitle}>
                  무엇을 도와드릴까요?
                </div>

                <ul style={aiAssistantLauncherStyles.suggestionList}>
                  <li
                    style={aiAssistantLauncherStyles.suggestionItem}
                    onClick={handleContinueWriting}
                  >
                    <div style={aiAssistantLauncherStyles.suggestionIcon}>
                      <AutoAwesome sx={{ fontSize: 16 }} />
                    </div>
                    <span>이어서 쓰기 (Drafting)</span>
                  </li>

                  <li
                    style={aiAssistantLauncherStyles.suggestionItem}
                    onClick={handleTranslate}
                  >
                    <div style={aiAssistantLauncherStyles.suggestionIcon}>
                      <Translate sx={{ fontSize: 16 }} />
                    </div>
                    <span>이 페이지 번역 (영어)</span>
                  </li>

                  <li
                    style={aiAssistantLauncherStyles.suggestionItem}
                    onClick={handleSummarize}
                  >
                    <div style={aiAssistantLauncherStyles.suggestionIcon}>
                      <Search sx={{ fontSize: 16 }} />
                    </div>
                    <span>요약 및 인사이트</span>
                  </li>
                </ul>
              </>
            ) : null}

            {/* Chat messages */}
            <div style={aiAssistantLauncherStyles.messagesList}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={
                    message.role === "user"
                      ? aiAssistantLauncherStyles.messageRowUser
                      : aiAssistantLauncherStyles.messageRowAssistant
                  }
                >
                  {message.content}
                </div>
              ))}

              {loading && (
                <div style={aiAssistantLauncherStyles.loadingText}>
                  AI가 답변을 생성하는 중...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Text input area */}
          <div style={aiAssistantLauncherStyles.inputWrapOuter}>
            <div style={aiAssistantLauncherStyles.inputWrap}>
              <div style={aiAssistantLauncherStyles.inputTagsRow}>
                <span style={aiAssistantLauncherStyles.inputTag}>
                  👋 Notion에 오신 것을 환영합니다!
                </span>
              </div>

              <div style={aiAssistantLauncherStyles.inputTextRow}>
                <input
                  style={aiAssistantLauncherStyles.inputText}
                  placeholder="무엇이든 물어보거나, 검색하거나, 만드세요..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  type="button"
                  style={{
                    ...aiAssistantLauncherStyles.sendButton,
                    opacity: input.trim().length === 0 ? 0.5 : 1,
                    cursor: input.trim().length === 0 ? "default" : "pointer",
                  }}
                  onClick={handleSend}
                  disabled={loading || input.trim().length === 0}
                >
                  <ArrowUpward sx={{ fontSize: 16 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantLauncher;
