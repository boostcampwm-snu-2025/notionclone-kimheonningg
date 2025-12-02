import type { PartialBlock } from "@blocknote/core";

export const FALLBACK_BLOCKS: PartialBlock[] = [
  {
    type: "paragraph",
    content: [
      {
        type: "text",
        text: "",
        styles: {},
      },
    ],
  },
];
