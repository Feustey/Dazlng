"use client";

import * as React from "react";

import { Github, Send, Twitter } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/Feustey/Dazlng",
    icon: Github,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/dazlng",
    icon: Twitter,
  },
  {
    name: "Telegram",
    url: "https://t.me/dazlng",
    icon: Send,
  },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-orange-500 transition-colors"
            aria-label={link.name}
          >
            <Icon className="w-6 h-6" />
          </a>
        );
      })}
    </div>
  );
}
