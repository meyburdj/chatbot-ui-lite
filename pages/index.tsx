import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import InputModal from "@/components/InputModal";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const [gradeLevel, setGradeLevel] = useState<string>('');
  const [academicTopic, setAcademicTopic] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];
    console.log("Sending messages to API:", updatedMessages);

    setMessages(updatedMessages);
    setLoading(true);

    const messagesToSend = updatedMessages.slice(1);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: messagesToSend,
        grade_level: gradeLevel,
        academic_topic: academicTopic
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: chunkValue
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm Concept bot, an AI education assistant. I can help you better understand concepts. Before we get started, please provide your grade level and the class you are in. For example, "I'm in 10th grade and have questions related to my World History class."`
      }
    ]);
  };

  const handleModalSubmit = (grade: string, topic: string) => {
    setGradeLevel(grade);
    setAcademicTopic(topic);
    setModalOpen(false);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm Concept bot, an AI education assistant. I can help you better understand concepts. Before we get started, please provide your grade level and the class you are in. For example, "I'm in 10th grade and have questions related to my World History class."`
      }
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Concept bot</title>
        <meta
          name="description"
          content="An educational chatbot powered by Nemo-guardrails, Llamaguard, and Openai."
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
              messages={messages}
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
