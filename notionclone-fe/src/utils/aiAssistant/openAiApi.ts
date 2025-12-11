import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn("VITE_OPENAI_API_KEY is missing in .env");
}

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

export async function askOpenAI(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    });

    const text = response.choices[0]?.message?.content || "";
    return text.trim();
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "AI 응답을 받아올 수 없습니다.";
  }
}

export async function askOpenAIWithSystemPrompt(
  systemContent: string,
  userPrompt: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userPrompt },
      ],
    });

    return response.choices[0]?.message?.content?.trim() ?? "";
  } catch (error) {
    console.error(error);
    return "AI 응답 생성 중 오류 발생";
  }
}

export async function askOpenAIStream(
  prompt: string,
  onToken: (token: string) => void
): Promise<void> {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) onToken(token);
    }
  } catch (error) {
    console.error("Stream error:", error);
    onToken("오류 발생");
  }
}
