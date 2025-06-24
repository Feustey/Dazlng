"use client";

import React from 'react';

export interface NotificationBadgeProps {
  count?: number;
  show: boolean;
}

export default function NotificationBadge({ count = 0, show }: NotificationBadgeProps): React.FC | null {
  if (!show || count === 0) return null;

  return (
    <span
      className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-[#F7931A] flex items-center justify-center px-1.5 animate-scale-in"
    >
      <span className="text-white text-xs font-semibold">{count}</span>
    </span>
};
}

// Ajoute dans ton CSS global ou tailwind.config.js :
// @keyframes scale-in { from { transform: scale(0); } to { transform: scale(1); } }
// .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.4,0,0.2,1); } 