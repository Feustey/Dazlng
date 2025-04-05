"use client";

import * as React from "react";
import { Squada_One } from "next/font/google";

const squadaOne = Squada_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface SimpleLogoProps {
  className?: string;
}

export const SimpleLogo: React.FC<SimpleLogoProps> = ({ className = "" }) => {
  return (
    <div className="logo-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 150"
        className={`h-[100px] w-auto ${className}`}
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#22c55e", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        <path
          d="M50 80 L80 50 L110 80 L90 80 L110 110 L80 110 Z"
          fill="#f97316"
        />

        <text
          x="130"
          y="100"
          fontFamily={`${squadaOne.style.fontFamily}, Arial, sans-serif`}
          fontSize="70"
          fontWeight="400"
          fill="url(#textGradient)"
        >
          DazLng
        </text>
      </svg>
    </div>
  );
};
