import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

import type { CSSProperties } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import { NOTION_WELCOME_CONTENT } from "../../constants/notionWelcome";

const welcomeStyles: Record<string, CSSProperties> = {
  wrap: {
    margin: "0 auto",
    paddingTop: "20px",
  },
};

const NotionWelcomePage = () => {
  const editor = useCreateBlockNote({
    initialContent: NOTION_WELCOME_CONTENT,
  });

  return (
    <main style={welcomeStyles.wrap}>
      <BlockNoteView editor={editor} theme="light" />
    </main>
  );
};

export default NotionWelcomePage;
