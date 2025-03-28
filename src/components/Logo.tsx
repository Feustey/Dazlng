// src/components/Logo.tsx
import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 150" 
      className={`h-[70px] ${className}`}
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'var(--blue-500)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'var(--green-500)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      <path 
        d="M50 80 L80 50 L110 80 L90 80 L110 110 L80 110 Z" 
        fill="var(--orange-500)"
      />
      
      <text 
        x="130" 
        y="100" 
        fontFamily="Squada One, Arial, sans-serif" 
        fontSize="60" 
        fontWeight="400" 
        fill="url(#textGradient)"
      >
        DazLng
      </text>
    </svg>
  );
};
