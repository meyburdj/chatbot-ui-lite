import { Message } from "@/types";
import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const requestBody = await req.json();
    const { messages, grade_level: gradeLevel, academic_topic: academicTopic } = requestBody as {
      messages: Message[];
      grade_level: string;
      academic_topic: string;
    };

    const charLimit = 12000;
    let charCount = 0;
    let messagesToSend = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (charCount + message.content.length > charLimit) {
        break;
      }
      charCount += message.content.length;
      messagesToSend.push(message);
    }

    const stream = await OpenAIStream(messagesToSend, gradeLevel, academicTopic);
    console.log("response stuff :", stream)
    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
