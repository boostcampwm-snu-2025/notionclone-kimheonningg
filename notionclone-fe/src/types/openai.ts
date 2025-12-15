export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ToneType =
  | "professional"
  | "casual"
  | "friendly"
  | "confident"
  | "academic";

export type LanguageType = "english" | "korean";
