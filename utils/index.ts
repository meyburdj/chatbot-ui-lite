import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (messages: Message[], gradeLevel: string, academicTopic: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const body = JSON.stringify({
    messages,
    gradeLevel,
    academicTopic
  })

  console.log('body :', body)
  const res = await fetch("http://localhost:5004/filter", {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: body
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("chatbot filter raised an error: ", errorBody);
    throw new Error(`chatbot filter raised an error (${res.status}): ${errorBody}`);
  }
  const data = await res.json();
  console.log("Response data: ", data); const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return data;
};
