import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  isUser: boolean;
}

const MarkdownRenderer = ({ content, isUser }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // p
        p: ({ children }) => (
          <p style={{ margin: "0 0 6px 0", lineHeight: "1.6" }}>{children}</p>
        ),
        // a
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isUser ? "var(--white)" : "var(--blue-600)",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            {children}
          </a>
        ),
        // list(ul, ol, li)
        ul: ({ children }) => (
          <ul style={{ margin: "4px 0", paddingLeft: 20 }}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol style={{ margin: "4px 0", paddingLeft: 20 }}>{children}</ol>
        ),
        li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
        // code block(code)
        code: (props) => {
          const { children, className, node, ...rest } = props;
          const isBlock = /language-(\w+)/.exec(className || "");

          return (
            <code
              {...rest}
              style={{
                background: isUser
                  ? "rgba(255,255,255,0.2)"
                  : "var(--gray-100)",
                color: isUser ? "inherit" : "var(--red-500)",
                padding: "2px 5px",
                borderRadius: 4,
                fontSize: "0.9em",
                fontFamily: "monospace",
                display: isBlock ? "block" : "inline",
                whiteSpace: "pre-wrap",
                marginBottom: isBlock ? "8px" : "0",
              }}
            >
              {children}
            </code>
          );
        },
        // headers(h1~h3)
        h1: ({ children }) => (
          <h3
            style={{
              fontSize: "1.25em",
              fontWeight: 700,
              margin: "10px 0 6px",
            }}
          >
            {children}
          </h3>
        ),
        h2: ({ children }) => (
          <h4
            style={{ fontSize: "1.1em", fontWeight: 700, margin: "8px 0 4px" }}
          >
            {children}
          </h4>
        ),
        h3: ({ children }) => (
          <strong
            style={{ display: "block", fontSize: "1em", margin: "6px 0" }}
          >
            {children}
          </strong>
        ),
        // blockquote
        blockquote: ({ children }) => (
          <blockquote
            style={{
              borderLeft: `3px solid ${
                isUser ? "rgba(255,255,255,0.5)" : "var(--gray-400)"
              }`,
              margin: "6px 0",
              paddingLeft: 10,
              fontStyle: "italic",
              color: isUser ? "rgba(255,255,255,0.9)" : "var(--gray-700)",
            }}
          >
            {children}
          </blockquote>
        ),
        // table
        table: ({ children }) => (
          <div style={{ overflowX: "auto", margin: "10px 0" }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                fontSize: "0.9em",
                border: isUser
                  ? "1px solid rgba(255,255,255,0.3)"
                  : "1px solid var(--gray-300)",
              }}
            >
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th
            style={{
              border: isUser
                ? "1px solid rgba(255,255,255,0.3)"
                : "1px solid var(--gray-300)",
              padding: "6px 8px",
              background: isUser ? "rgba(255,255,255,0.1)" : "var(--gray-50)",
              fontWeight: 600,
            }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td
            style={{
              border: isUser
                ? "1px solid rgba(255,255,255,0.3)"
                : "1px solid var(--gray-300)",
              padding: "6px 8px",
            }}
          >
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
