import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { chatSchema, safeParseBody } from "@/lib/validation";
import { apiResponse, handleApiError } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    // Parse and validate input
    const parseResult = await safeParseBody(req, chatSchema);
    if (!parseResult.success) {
      return apiResponse(null, parseResult.error, 400);
    }

    const { messages, systemPrompt } = parseResult.data;

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    // Stream the result as readable stream
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.fullStream) {
            if (chunk.type === "text-delta") {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk.text })}\n\n`)
              );
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    return handleApiError(err, "chat", {
      expose: "Error al procesar el chat.",
    });
  }
}
