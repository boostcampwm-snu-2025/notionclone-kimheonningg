export const extractTextFromBlocks = (blocks: any): string => {
  if (!blocks) return "";
  if (typeof blocks === "string") return blocks;
  return JSON.stringify(blocks);
};
