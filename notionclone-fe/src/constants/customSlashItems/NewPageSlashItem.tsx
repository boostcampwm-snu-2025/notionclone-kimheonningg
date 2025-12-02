import { DescriptionOutlined } from "@mui/icons-material";
import type { BlockNoteEditor } from "@blocknote/core";

export const NewPageSlashItem = (
  editor: BlockNoteEditor,
  onCreateChildPage: () => string
) => ({
  title: "새 페이지",
  aliases: ["page"],
  group: "Navigation",
  icon: <DescriptionOutlined fontSize="small" />,
  subtext: "현재 페이지의 하위 페이지를 만듭니다",
  onItemClick: () => {
    // Find the current block (where the cursor is located)
    const currentBlock = editor.getTextCursorPosition().block;

    // Before moving to the created page, change current block content and save
    editor.updateBlock(currentBlock, {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "📄 새 페이지",
          styles: { bold: true },
        },
      ],
    });

    // Create new page and move
    const newId = onCreateChildPage();
    console.log("created child page", newId);
  },
});
