import type { ReactNode, CSSProperties } from "react";
import { useState } from "react";

const menuItemStyles: Record<string, CSSProperties> = {
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.1s",
    gap: "10px",
    userSelect: "none",
  },
  menuItemHover: {
    backgroundColor: "var(--gray-100)",
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--gray-700)",
    minWidth: "20px",
  },
  label: {
    flex: 1,
    whiteSpace: "nowrap",
  },
};

const MenuItem = ({
  icon,
  label,
  onClick,
  color,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  color?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...menuItemStyles.menuItem,
        ...(isHovered ? menuItemStyles.menuItemHover : {}),
        color: color || "inherit",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <div style={menuItemStyles.iconWrapper}>{icon}</div>
      <div style={menuItemStyles.label}>{label}</div>
    </div>
  );
};

export default MenuItem;
