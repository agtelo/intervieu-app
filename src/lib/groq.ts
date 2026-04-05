import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function callGroq(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const message = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 4096,
    messages: systemPrompt
      ? [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ]
      : [{ role: "user", content: prompt },],
  });

  const content = message.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No text response from Groq");
  }

  return content;
}

export async function* streamGroq(
  prompt: string,
  systemPrompt: string
) {
  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 4096,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield { response: content };
    }
  }
}
