"use client";

import { Card } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface MessageProps {
  content: string;
  sender: string;
  timestamp: string;
  avatar?: string;
  isUser?: boolean;
  language?: string;
}

export function Message({
  content,
  sender,
  timestamp,
  avatar,
  isUser = false,
  language = "fr",
}: MessageProps) {
  const locale = language === "fr" ? fr : enUS;
  const timeAgo = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale,
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={sender} />
          <AvatarFallback>{sender[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <Card
        className={`p-4 max-w-[80%] ${
          isUser ? "bg-primary text-primary-foreground" : ""
        }`}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold mb-1">
            {isUser ? "Vous" : sender}
          </span>
          <p className="whitespace-pre-wrap">{content}</p>
          <span className="text-xs opacity-70 mt-2">{timeAgo}</span>
        </div>
      </Card>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={sender} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
