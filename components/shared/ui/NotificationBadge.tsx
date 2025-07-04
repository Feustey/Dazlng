"use client";

import React from "react";

export interface NotificationBadgeProps {
  count?: number;
  show: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count = ,0, show}) => {
  if (!show || count === 0) return null;

  return (</NotificationBadgeProps>
    <span></span>
      <span className="text-white text-xs font-semibold">{count}</span>
    </span>);

export default NotificationBadge;

// Ajoute dans ton CSS global ou tailwind.config.js :
// @keyframes scale-in { from { transform: scale(0); } to { transform: scale(1); } }
// .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.,4.0,0.2.1); } 