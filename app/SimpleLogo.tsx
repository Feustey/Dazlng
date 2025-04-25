"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // si tu utilises class-variance-authority ou une fonction cn

interface SimpleLogoProps {
  className?: string;
}

export const SimpleLogo: React.FC<SimpleLogoProps> = ({ className = "" }) => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M16 2L2 9V23L16 30L30 23V9L16 2Z"
          className="fill-[#4169E1] dark:fill-[#4F6FED]"
        />
        <path
          d="M16 6L6 11V21L16 26L26 21V11L16 6Z"
          className="fill-white dark:fill-[#0A0E1A]"
        />
        <path
          d="M16 10L10 13V19L16 22L22 19V13L16 10Z"
          className="fill-[#FFC107] dark:fill-[#FFD54F]"
        />
      </svg>
      <span
        className={cn(
          "text-xl font-bold bg-gradient-to-r from-[#5B6FFF] via-[#B56CFF] to-[#FF7F50] bg-clip-text text-transparent",
          className
        )}
      >
        Daznode
      </span>
    </Link>
  );
};
