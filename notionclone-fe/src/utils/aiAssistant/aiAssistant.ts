import type { Block } from "@blocknote/core";

import { askOpenAIWithSystemPrompt } from "./openAiApi";
import { loadInitialPageState } from "../storage/pageStorage";

import { DEFAULT_PAGE_ICON } from "../../constants/page";

const serializeBlocksToText = (blocks: Block[] | undefined | null): string => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return "(내용 없음)";
  }

  try {
    return JSON.stringify(blocks, null, 2);
  } catch (e) {
    console.error("Block parsing error", e);
    return "";
  }
};

const getCurrentPageContext = () => {
  // Load current page state
  const pageState = loadInitialPageState();

  if (!pageState || !pageState.activeId) {
    return null;
  }

  // Find currently activated page
  const activePage = pageState.pages[pageState.activeId];

  if (!activePage) {
    return null;
  }

  const blocks = activePage.blocks as Block[];

  // Make context object for AI
  return {
    title: activePage.title || "제목 없음",
    icon: activePage.icon || DEFAULT_PAGE_ICON,
    content: serializeBlocksToText(blocks),
    updatedAt: activePage.updatedAt,
  };
};

const generateSystemPromptWithContext = (
  context: ReturnType<typeof getCurrentPageContext>
) => {
  const basePrompt = `
당신은 'BlockNote' 에디터를 사용하는 Notion 클론 앱의 AI Assistant입니다.
사용자는 현재 문서를 작성 중이며, 당신은 이 문서의 문맥을 파악해 도움을 주어야 합니다.

[답변 가이드라인]
1. 답변은 명확하고 간결하게 작성하세요.
2. 답변의 포맷은 **Markdown** 형식을 사용하세요. (BlockNote가 Markdown을 지원하기 때문입니다)
3. JSON 형태의 Block 구조를 입력받으면, 그 안의 텍스트 내용("content", "text")과 구조("type", "children")를 해석하여 답변하세요.
`;

  if (!context) {
    return `${basePrompt}\n(⚠️ 현재 페이지 정보를 불러올 수 없습니다. 일반적인 도우미로서 답변하세요.)`;
  }

  return `
${basePrompt}

[현재 보고 있는 페이지 정보]
- 제목: ${context.icon} ${context.title}
- 마지막 수정: ${context.updatedAt}
- 본문 데이터 (BlockNote JSON):
\`\`\`json
${context.content}
\`\`\`

위 [현재 보고 있는 페이지 정보]를 바탕으로 사용자의 요청에 응답하세요.
문서 내용에 없는 사실을 지어내지 말고, 오직 제공된 데이터에 기반해 답변하세요.
`;
};

export async function chatWithPageContext(userPrompt: string): Promise<string> {
  const context = getCurrentPageContext();
  const systemPrompt = generateSystemPromptWithContext(context);

  return await askOpenAIWithSystemPrompt(systemPrompt, userPrompt);
}

export async function summarizeCurrentPage(): Promise<string> {
  const context = getCurrentPageContext();
  const systemPrompt = generateSystemPromptWithContext(context);

  const userInstruction = `
현재 페이지의 내용을 요약해주세요. BlockNote JSON 구조를 해석하여 실제 텍스트 내용을 파악하세요.
다음 형식을 따라 답변하세요:

### 요약
1. **핵심 주제**: (한 문장으로 요약)
2. **주요 포인트**:
   - (내용 1)
   - (내용 2)
   - (내용 3)
`;

  return await askOpenAIWithSystemPrompt(systemPrompt, userInstruction);
}

export async function translateCurrentPage(
  targetLang: string = "English"
): Promise<string> {
  const context = getCurrentPageContext();
  const systemPrompt = generateSystemPromptWithContext(context);

  const userInstruction = `
현재 페이지의 텍스트 내용 전체를 '${targetLang}'로 번역해주세요.
JSON 문법이나 키값(type, id 등)은 제외하고, 사람이 읽을 수 있는 **번역된 텍스트**만 문단별로 나누어 출력하세요.
`;

  return await askOpenAIWithSystemPrompt(systemPrompt, userInstruction);
}

export async function continueWritingPage(): Promise<string> {
  const context = getCurrentPageContext();
  const systemPrompt = generateSystemPromptWithContext(context);

  const userInstruction = `
이 문서의 맥락을 파악하여, 마지막 부분에 이어질 자연스러운 내용을 2~3 문단 정도 추가로 작성해주세요.
작성된 내용은 Markdown 형식으로 출력해주세요. (BlockNote에 붙여넣기 좋게)
`;

  return await askOpenAIWithSystemPrompt(systemPrompt, userInstruction);
}
