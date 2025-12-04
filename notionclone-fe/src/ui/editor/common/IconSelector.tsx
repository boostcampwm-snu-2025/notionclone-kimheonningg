import { useState, useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

interface IconSelectorProps {
  icon: string;
  onIconChange: (newIcon: string) => void;
}

const styles: Record<string, CSSProperties> = {
  container: {
    position: "relative",
    display: "inline-block",
    cursor: "pointer",
    userSelect: "none",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  popover: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: "8px",
    zIndex: 1000,
    boxShadow:
      "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px",
    borderRadius: "8px",
    backgroundColor: "white",
  },
};

const IconSelector = ({ icon, onIconChange }: IconSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onIconChange(emojiData.emoji);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} style={styles.container}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        title="아이콘 변경"
        style={{ width: "100%", height: "100%" }}
      >
        {icon}
      </div>

      {isOpen && (
        <div style={styles.popover}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={Theme.LIGHT}
            width={350}
            height={400}
            searchPlaceHolder="검색"
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
};

export default IconSelector;
