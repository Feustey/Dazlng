"use client";

import { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "bot";
}

interface BotContent {
  title: string;
  description: string;
  inputPlaceholder: string;
  sendButton: string;
  thinking: string;
  errors: {
    loadFailed: string;
    sendFailed: string;
    timeout: string;
  };
  maxLength: number;
}

const STORAGE_KEY = "app_bot_conversations";
const MAX_RETRIES = 3;
const TIMEOUT = 10000; // 10 secondes

export default function BotPage() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [content, setContent] = useState<BotContent | null>(null);

  useEffect(() => {
    // Charger les conversations sauvegardées
    const savedConversations = localStorage.getItem(STORAGE_KEY);
    if (savedConversations) {
      const parsedMessages = JSON.parse(savedConversations);
      setMessages(parsedMessages);
    }

    // Charger le contenu traduit
    async function fetchContent() {
      try {
        const response = await fetch(`/locale/bot-ia/${language}.json`);
        if (!response.ok) throw new Error("Failed to load content");
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading bot content:", error);
        toast.error("Failed to load bot");
      }
    }

    fetchContent();
  }, [language]);

  const saveConversation = (updatedMessages: Message[]) => {
    setMessages(updatedMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking || !content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      timestamp: new Date().toISOString(),
      sender: "user",
    };

    const updatedMessages = [...messages, userMessage];
    saveConversation(updatedMessages);
    setInput("");
    setIsThinking(true);

    let retries = 0;
    const tryGetBotResponse = async (): Promise<void> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

        const response = await fetch("/api/bot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
            language,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to get bot response");
        }

        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          timestamp: new Date().toISOString(),
          sender: "bot",
        };

        saveConversation([...updatedMessages, botMessage]);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error(content.errors.timeout);
        } else if (retries < MAX_RETRIES) {
          retries++;
          await tryGetBotResponse();
        } else {
          toast.error(content.errors.sendFailed);
        }
      } finally {
        setIsThinking(false);
      }
    };

    await tryGetBotResponse();
  };

  if (!content) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
      <p className="text-gray-600 mb-8">{content.description}</p>

      <div className="space-y-4 mb-6">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`p-4 ${
              message.sender === "user" ? "ml-auto" : "mr-auto"
            } max-w-[80%]`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold mb-1">
                {message.sender === "user" ? "Vous" : "Assistant"}
              </span>
              <p>{message.content}</p>
              <span className="text-xs text-gray-500 mt-2">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
          </Card>
        ))}
        {isThinking && (
          <Card className="p-4 mr-auto max-w-[80%]">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              <span>{content.thinking}</span>
            </div>
          </Card>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={content.inputPlaceholder}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isThinking}
          maxLength={content.maxLength}
        />
        <Button onClick={handleSendMessage} disabled={isThinking}>
          {content.sendButton}
        </Button>
      </div>
    </div>
  );
}
