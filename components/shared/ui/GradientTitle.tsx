import { ReactNode } from "react";

export default function GradientTitle({ children, className = "" }: { children: ReactNode, className?: string }): React.ReactElement {
  return (
    <h1 className={`text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-orange-400 via-yellow-300 to-pink-500 bg-clip-text text-transparent ${className}`}>
      {children}
    </h1>
  );
} 