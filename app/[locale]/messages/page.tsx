"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Message } from "@components/ui/message";
import { Loading } from "@components/ui/loading";
import { useLanguage } from "@contexts/LanguageContext";
import { toast } from "sonner";
import { Search, Send } from "lucide-react";

interface MessageData {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  avatar?: string;
}

interface MessagesContent {
  title: string;
  searchPlaceholder: string;
  sendButton: string;
  inputPlaceholder: string;
  errors: {
    loadFailed: string;
    sendFailed: string;
  };
  pagination: {
    loadMore: string;
    noMore: string;
  };
}

const STORAGE_KEY = "app_messages";
const MESSAGES_PER_PAGE = 10;

export default function MessagesPage() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [content, setContent] = useState<MessagesContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Charger les messages sauvegardés
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      setMessages(parsedMessages);
    }

    // Charger le contenu traduit
    async function fetchContent() {
      try {
        const response = await fetch(`/locale/messages/${language}.json`);
        if (!response.ok) throw new Error("Failed to load content");
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading messages content:", error);
        toast.error(content?.errors.loadFailed || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: MessageData = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "user",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    setNewMessage("");
  };

  const filteredMessages = messages.filter((message) =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedMessages = filteredMessages.slice(0, page * MESSAGES_PER_PAGE);

  const loadMore = () => {
    if (paginatedMessages.length < filteredMessages.length) {
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
  };

  if (loading || !content) return <Loading type="list" count={5} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{content.title}</h1>

      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={content.searchPlaceholder}
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
        {paginatedMessages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            avatar={message.avatar}
            isUser={message.sender === "user"}
            language={language}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {hasMore && (
        <Button variant="outline" className="w-full mb-6" onClick={loadMore}>
          {content.pagination.loadMore}
        </Button>
      )}

      <div className="flex gap-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={content.inputPlaceholder}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          maxLength={500}
        />
        <Button onClick={handleSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
