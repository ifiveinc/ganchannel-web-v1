export interface LLMCompletionChunk {
  type: "text" | "done" | "error";
  text?: string;
}

export interface LLMCompletionParams {
  systemPrompt: string;
  context: string;
  question: string;
}

export interface LLMProvider {
  readonly name: string;
  complete(params: LLMCompletionParams): AsyncIterable<LLMCompletionChunk>;
}
