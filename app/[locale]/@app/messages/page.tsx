"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2, Send, ExternalLink } from "lucide-react";
import Link from "next/link";

interface TelegramMessage {
  message_id: number;
  date: number;
  text: string;
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
}

interface TelegramChat {
  id: number;
  title: string;
  username: string;
  type: string;
  description?: string;
}

interface TelegramData {
  channelInfo: TelegramChat;
  messages: TelegramMessage[];
  channelLink: string;
  botLink: string;
}

export default function MessagesPage() {
  const [data, setData] = useState<TelegramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/telegram");
        if (!response.ok) {
          throw new Error("Failed to fetch Telegram data");
        }
        const telegramData = await response.json();
        setData(telegramData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-gray-100 border-l-4 border-orange-400">
          <h1 className="text-2xl font-bold mb-4">Canal Telegram DazLng</h1>
          <p className="mb-4">
            Nous rencontrons actuellement des difficultés pour accéder aux
            données du canal Telegram.
          </p>
          <p className="mb-4">
            Vous pouvez toujours accéder directement au bot Telegram en cliquant
            sur le bouton ci-dessous.
          </p>
          <Link href="https://t.me/DazLngBot" target="_blank">
            <Button>
              <ExternalLink className="mr-2 h-4 w-4" />
              Accéder au bot
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Canal Telegram DazLng</h1>
        <div className="flex gap-4">
          <Link href={data.channelLink} target="_blank">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Rejoindre le canal
            </Button>
          </Link>
          <Link href={data.botLink} target="_blank">
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Interagir avec le bot
            </Button>
          </Link>
        </div>
      </div>

      {data.channelInfo.description && (
        <Card className="p-4 mb-6">
          <p className="text-muted-foreground">
            {data.channelInfo.description}
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {data.messages && Array.isArray(data.messages) ? (
          data.messages.map((message) => (
            <Card key={message.message_id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">
                    {message.from.first_name}
                    {message.from.username && ` (@${message.from.username})`}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {new Date(message.date * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="whitespace-pre-wrap">{message.text}</p>
            </Card>
          ))
        ) : (
          <Card className="p-4">
            <p className="text-muted-foreground">Aucun message disponible</p>
          </Card>
        )}
      </div>
    </div>
  );
}
