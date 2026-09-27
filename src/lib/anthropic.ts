import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-haiku-4-5";

export async function callAnthropic(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("No text response from Anthropic");
  }

  return block.text;
}

export async function* streamAnthropic(prompt: string, systemPrompt: string) {
  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield { response: event.delta.text };
    }
  }
}
