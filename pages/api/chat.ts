import { Message } from "@/types";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const requestBody = await req.json();
    const { clientMessages, promptMessages, grade_level: gradeLevel, academic_topic: academicTopic } = requestBody;

    const body = JSON.stringify({
      promptMessages,
      clientMessages,
      gradeLevel,
      academicTopic
    });

    const res = await fetch(`${process.env.FILTER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Chatbot filter raised an error:", errorBody);
      return new Response(`Chatbot filter raised an error (${res.status}): ${errorBody}`, { status: 500 });
    }

    const data = await res.json();
    console.log("Response data from the filter:", data);

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Server error:", error);
    return new Response("Server error", { status: 500 });
  }
};

export default handler;
