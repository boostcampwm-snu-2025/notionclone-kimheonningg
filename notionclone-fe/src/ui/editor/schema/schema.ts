import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { PageLink } from "../blocks/PageLink";

// Add custom block pageLink to defaultBlockSpecs
export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    pageLink: PageLink(),
  },
});

export type CustomSchema = typeof schema;
