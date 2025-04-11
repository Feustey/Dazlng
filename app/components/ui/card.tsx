"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  gradient = false,
  hover = true,
  onClick,
}: CardProps) {
  const baseClasses = "card-glass p-6";
  const hoverClasses = hover
    ? "transition-transform duration-300 hover:scale-[1.02]"
    : "";
  const gradientClasses = gradient
    ? "bg-gradient-to-br from-primary-600/20 via-secondary-600/20 to-accent-600/20"
    : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Sous-composants pour une meilleure organisation
export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>{children}</div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-2xl font-bold text-gradient ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`pt-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center pt-4 ${className}`}>{children}</div>
  );
}
