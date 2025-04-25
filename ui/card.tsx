"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
  translucent?: boolean;
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = "",
      gradient = false,
      hover = true,
      translucent = false,
      onClick,
    },
    ref
  ) => {
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
        ref={ref}
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
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ children, className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-bold text-gradient", className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

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

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={cn("pt-4", className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

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

export default Card;
