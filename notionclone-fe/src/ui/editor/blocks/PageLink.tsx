import { createReactBlockSpec } from "@blocknote/react";
import { DescriptionOutlined } from "@mui/icons-material";

// Custom block PageLink
export const PageLink = createReactBlockSpec(
  {
    type: "pageLink",
    propSchema: {
      id: { default: "" },
      title: { default: "Untitled" },
    },
    content: "none",
  },
  {
    render: (props) => {
      return (
        <div
          // Make editor regard this block as "not a text"
          contentEditable={false}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 6px",
            borderRadius: 4,
            cursor: "pointer",
            userSelect: "none",
            backgroundColor: "transparent",
            transition: "background 0.2s",
            marginTop: 4,
            marginBottom: 4,
          }}
          // Mouse hovering effect
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--gray-100)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          // Custom event occurs when clicked -> Navigates to page
          onClick={() => {
            const event = new CustomEvent("navigate-to-page", {
              detail: props.block.props.id,
            });
            window.dispatchEvent(event);
          }}
        >
          {/* Icon */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--gray-500)",
            }}
          >
            <DescriptionOutlined style={{ fontSize: 20 }} />
          </span>

          {/* Title */}
          <span
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "var(--gray-700)",
              textDecoration: "none",
              borderBottom: "1px solid var(--gray-300)",
            }}
          >
            {props.block.props.title}
          </span>
        </div>
      );
    },
  }
);
