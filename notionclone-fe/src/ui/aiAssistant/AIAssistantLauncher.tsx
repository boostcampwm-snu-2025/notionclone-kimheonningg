import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import {
  EmojiEmotionsOutlined,
  Close,
  ArrowUpward,
  AutoAwesome,
  Translate,
  Search,
  PlaylistAddCheckCircle,
} from "@mui/icons-material";

import { askOpenAI } from "../../utils/aiAssistant/openAiApi";
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
  },
  loadingText: {
    fontSize: 12,
    color: "var(--gray-500)",
    marginTop: 4,
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

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Clear other content and add text bubbles
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    setLoading(true);
    try {
      const reply = await askOpenAI(trimmed);

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

  const handleSend = () => {
    void sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {!open && (
        <button
          type="button"
          style={aiAssistantLauncherStyles.floatingButton}
          onClick={handleToggle}
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
                  <li style={aiAssistantLauncherStyles.suggestionItem}>
                    <div style={aiAssistantLauncherStyles.suggestionIcon}>
                      <AutoAwesome sx={{ fontSize: 16 }} />
                    </div>
                    <span>Notion AI 개인화하기</span>
                  </li>

                  <li style={aiAssistantLauncherStyles.suggestionItem}>
                    <div style={aiAssistantLauncherStyles.suggestionIcon}>
                      <Translate sx={{ fontSize: 16 }} />
                    </div>
                    <span>이 페이지 번역</span>
                  </li>

                  <li style={aiAssistantLauncherStyles.suggestionItem}>
                    <div style={aiAssistantLauncherStyles.suggestionIcon}>
                      <Search sx={{ fontSize: 16 }} />
                    </div>
                    <span>분석하여 인사이트 얻기</span>
                  </li>

                  <li style={aiAssistantLauncherStyles.suggestionItem}>
                    <div style={aiAssistantLauncherStyles.suggestionIcon}>
                      <PlaylistAddCheckCircle sx={{ fontSize: 16 }} />
                    </div>
                    <span>작업 트래커 만들기</span>
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
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  type="button"
                  style={aiAssistantLauncherStyles.sendButton}
                  onClick={handleSend}
                  disabled={loading || input.trim().length === 0} // Disable
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
