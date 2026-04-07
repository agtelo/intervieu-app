import { streamGroq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, systemPrompt } = body;

    if (!messages || !systemPrompt) {
      return new Response(
        JSON.stringify({ data: null, error: "Faltan datos para el chat." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build conversation context from messages
    const conversationContext = messages
      .map((m: { role: string; content: string }) => {
        const role = m.role === "user" ? "User" : "Assistant";
        return `${role}: ${m.content}`;
      })
      .join("\n");

    const fullPrompt = `${conversationContext}\n\nAssistant:`;

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let isClosed = false;

        try {
          // Use streaming from Groq
          const response = streamGroq(fullPrompt, systemPrompt);

          for await (const chunk of response) {
            if (isClosed) break;
            if (chunk.response) {
              try {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ text: chunk.response })}\n\n`
                  )
                );
              } catch (e) {
                if ((e as any)?.code === "ERR_INVALID_STATE") {
                  isClosed = true;
                  break;
                }
                throw e;
              }
            }
          }

          if (!isClosed) {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            isClosed = true;
          }
        } catch (error) {
          console.error("Stream error:", error);
          if (!isClosed) {
            try {
              controller.error(error);
            } catch (e) {
              // Controller already closed
            }
            isClosed = true;
          }
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Error in chat:", err);
    return new Response(
      JSON.stringify({ data: null, error: "Error en el chat." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
