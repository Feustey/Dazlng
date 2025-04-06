"use client";

import * as React from "react";

interface SimpleLogoProps {
  className?: string;
}

export const SimpleLogo: React.FC<SimpleLogoProps> = ({ className = "" }) => {
  return (
    <div className="logo-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={`h-8 w-8 ${className}`}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M30 50 L45 65 L70 35"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="ml-2 text-xl font-bold">DazLng</span>
    </div>
  );
};
