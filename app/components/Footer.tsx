import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Github, MessageSquare, Send, Twitter } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gris-900">
      <div className="pt-8 border-t border-gris-800">
        <div className="container mx-auto px-4 md:px-[145px]">
          <div className="py-2 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-body-small text-gris-300 whitespace-nowrap">
                DazLng est votre gestionnaire de nœud Lightning Network
                tout-en-un.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/feustey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gris-300 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/dazlng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gris-300 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://discord.gg/dazlng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gris-300 hover:text-white"
                aria-label="Discord"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/+LbcneuuYISFlZmI0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gris-300 hover:text-white"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
              <Logo className="h-12 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
