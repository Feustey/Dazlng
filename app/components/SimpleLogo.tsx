"use client";

import * as React from "react";

interface SimpleLogoProps {
  className?: string;
}

export const SimpleLogo: React.FC<SimpleLogoProps> = ({ className = "" }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Logo SVG */}
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
          className="fill-blue-500 dark:fill-blue-400"
        />
        <path
          d="M16 6L6 11V21L16 26L26 21V11L16 6Z"
          className="fill-white dark:fill-gray-900"
        />
        <path
          d="M16 10L10 13V19L16 22L22 19V13L16 10Z"
          className="fill-yellow-500 dark:fill-yellow-400"
        />
      </svg>

      {/* Texte stylisé */}
      <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-200">
        Daznode
      </span>
    </div>
  );
};
