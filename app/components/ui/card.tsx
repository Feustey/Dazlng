"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
  translucent?: boolean;
  onClick?: () => void;
}

const Card = ({
  children,
  className = "",
  gradient = false,
  hover = true,
  translucent = false,
  onClick,
}: CardProps) => {
  const baseClasses = "rounded-lg border shadow-lg p-6";
  const hoverClasses = hover
    ? "transition-transform duration-300 hover:scale-[1.02]"
    : "";
  const gradientClasses = gradient
    ? "bg-gradient-to-br from-primary-600/20 via-secondary-600/20 to-accent-600/20"
    : "";
  const translucentClasses = translucent
    ? "bg-card/30 backdrop-blur-sm border-accent/20"
    : "bg-card";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={cn(
        baseClasses,
        hoverClasses,
        gradientClasses,
        translucentClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Sous-composants pour une meilleure organisation
const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>{children}</div>
  );
};

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("text-2xl font-bold text-gradient", className)}>
      {children}
    </h3>
  );
};

const CardDescription = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
};

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("pt-4", className)}>{children}</div>;
};

const CardFooter = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center pt-4", className)}>{children}</div>
  );
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

export type { CardProps };
export default Card;
