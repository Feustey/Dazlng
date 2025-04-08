"use client";

import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "sonner";
import { Bot, Send, User, Zap, Star, Quote } from "lucide-react";
import { cn } from "../lib/utils";

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

const recommendations = [
  {
    id: 1,
    title: "Optimisation des frais",
    description:
      "Réduction de 35% des frais de routing en ajustant dynamiquement les fees en fonction du volume des transactions et des heures de pointe.",
    improvement: "35% d'économie sur les frais",
    icon: Zap,
  },
  {
    id: 2,
    title: "Gestion intelligente des canaux",
    description:
      "Augmentation de 50% de la capacité effective en implémentant une stratégie de rééquilibrage automatique basée sur l'historique des transactions.",
    improvement: "50% de capacité en plus",
    icon: Zap,
  },
  {
    id: 3,
    title: "Sélection optimale des pairs",
    description:
      "Amélioration de 40% du taux de succès des transactions en sélectionnant des pairs fiables basés sur leur historique de performance.",
    improvement: "40% de succès en plus",
    icon: Zap,
  },
  {
    id: 4,
    title: "Configuration des timeouts",
    description:
      "Réduction de 25% des échecs de paiement en optimisant les paramètres de timeout en fonction de la topologie du réseau.",
    improvement: "25% d'échecs en moins",
    icon: Zap,
  },
  {
    id: 5,
    title: "Stratégie de liquidité",
    description:
      "Augmentation de 45% des revenus en optimisant la distribution de la liquidité entre les canaux entrants et sortants.",
    improvement: "45% de revenus en plus",
    icon: Zap,
  },
];

const testimonials = [
  {
    id: 1,
    name: "Alex M.",
    role: "Opérateur de nœud Lightning",
    content:
      "Grâce aux recommandations de DazLng, mon nœud est passé de quelques transactions par jour à plus de 100 ! La différence est impressionnante.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sophie L.",
    role: "Propriétaire de boutique en ligne",
    content:
      "L'assistant m'a aidé à optimiser mes canaux de paiement. Mes clients apprécient la rapidité des transactions maintenant.",
    rating: 5,
  },
  {
    id: 3,
    name: "Thomas D.",
    role: "Développeur Bitcoin",
    content:
      "Les conseils personnalisés sont vraiment pertinents. J'ai pu multiplier mes revenus de routing par 3 en suivant les recommandations.",
    rating: 5,
  },
  {
    id: 4,
    name: "Marie P.",
    role: "Gestionnaire de communauté Lightning",
    content:
      "Un outil indispensable pour quiconque gère un nœud Lightning. Le support est réactif et les suggestions sont toujours pertinentes.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lucas R.",
    role: "Entrepreneur crypto",
    content:
      "DazLng a transformé mon nœud Lightning d'un hobby en une véritable source de revenus. Je ne peux plus m'en passer !",
    rating: 5,
  },
];

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

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {content.description}
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl p-6 mb-12">
          <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <Card
                  className={cn(
                    "p-4 max-w-[80%]",
                    message.sender === "user"
                      ? "bg-purple-600 text-white dark:bg-purple-700"
                      : "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "rounded-full p-2",
                        message.sender === "user"
                          ? "bg-purple-500 dark:bg-purple-600"
                          : "bg-purple-100 dark:bg-purple-900"
                      )}
                    >
                      {message.sender === "user" ? (
                        <User className="h-4 w-4 text-white dark:text-purple-100" />
                      ) : (
                        <Bot className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            message.sender === "user"
                              ? "text-white"
                              : "text-gray-900 dark:text-white"
                          )}
                        >
                          {message.sender === "user" ? "Vous" : "Assistant"}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            message.sender === "user"
                              ? "text-purple-200"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p
                        className={cn(
                          message.sender === "user"
                            ? "text-white"
                            : "text-gray-700 dark:text-gray-200"
                        )}
                      >
                        {message.content}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <Card className="p-4 max-w-[80%] bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900">
                      <Bot className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 dark:border-purple-400"></div>
                      <span className="text-gray-700 dark:text-gray-200">
                        {content.thinking}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
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
              className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isThinking}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 dark:from-purple-700 dark:to-purple-800 dark:hover:from-purple-800 dark:hover:to-purple-900"
            >
              <Send className="h-4 w-4 mr-2" />
              {content.sendButton}
            </Button>
          </div>
        </Card>

        {/* Recommendations Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Recommandations qui font leurs preuves
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="p-6 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900">
                    <rec.icon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {rec.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-sm font-medium">
                      {rec.improvement}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Ils nous font confiance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="p-6 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-current text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
