import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import InputModal from "@/components/InputModal";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  //messages is the text displayed on the ui. Stored in client session
  const [clientMessages, setClientMessages] = useState<Message[]>([]);

  /**
  promptMessages is the message conversation as sent to the primary llm. Stored
  here in session data
  TODO: move promptMessages to db that lives with the filter
  */
  const [promptMessages, setPromptMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const [gradeLevel, setGradeLevel] = useState<string>('');
  const [academicTopic, setAcademicTopic] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedClientMessages = [...clientMessages, message];
    console.log("Sending messages to API:", updatedClientMessages);

    setClientMessages(updatedClientMessages);
    setLoading(true);

    const clientMessagesToSend = updatedClientMessages.slice(1);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        clientMessages: clientMessagesToSend,
        promptMessages: promptMessages,
        grade_level: gradeLevel,
        academic_topic: academicTopic
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = await response.json();
    const clientMessage = data.clientMessage
    const clientMessageObject: Message = {
      role: 'assistant',
      content: clientMessage
    };
    const updatedPromptMessages = data.promptMessages

    setClientMessages(currentMessages => [...currentMessages, clientMessageObject]);
    setPromptMessages(updatedPromptMessages)
    setLoading(false);

  };

  const handleReset = () => {
    setClientMessages([
      {
        role: "assistant",
        content: `Hi there! I'm Concept bot, an AI education assistant. I can help you better understand concepts and work through difficult problems. Please ask a question related to the academic topic entered and we'll get started learning!"`
      }
    ]);
    setPromptMessages([])
    setModalOpen(true)
  };

  const handleModalSubmit = (grade: string, topic: string) => {
    setGradeLevel(grade);
    setAcademicTopic(topic);
    setModalOpen(false);
  };
  useEffect(() => {
    scrollToBottom();
  }, [clientMessages]);

  useEffect(() => {
    setClientMessages([
      {
        role: "assistant",
        content: `Hi there! I'm Concept bot, an AI education assistant. I can help you better understand concepts and work through difficult problems. Please ask a question related to the academic topic entered and we'll get started learning!"`
      }
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Concept bot</title>
        <meta
          name="description"
          content="An educational ai-chatbot."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={clientMessages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer />
      </div>
      <InputModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} />

    </>
  );
}
