export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatCompletionChunk {
  choices: Array<{
    delta: { content?: string };
    finish_reason: string | null;
  }>;
}

const DOUBAO_API_URL =
  "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
const DOUBAO_MODEL = "doubao-1.5-pro-32k-250115";

export async function streamChat(
  messages: AiMessage[],
  apiKey: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (!apiKey) {
    onError("请先在设置页面配置豆包 API Key");
    return;
  }

  try {
    const response = await fetch(DOUBAO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DOUBAO_MODEL,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      if (response.status === 401) {
        onError("API Key 无效，请检查设置");
      } else if (response.status === 429) {
        onError("请求过于频繁，请稍后再试");
      } else {
        onError(`API 请求失败 (${response.status}): ${errorText}`);
      }
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError("无法读取响应流");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed: ChatCompletionChunk = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch {
          // skip malformed SSE chunks
        }
      }
    }

    onDone();
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      onDone();
      return;
    }
    onError(err instanceof Error ? err.message : "未知错误");
  }
}
