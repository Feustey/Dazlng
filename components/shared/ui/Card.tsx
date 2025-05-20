import { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode, className?: string }): React.ReactElement {
  return (
    <div className={`bg-white rounded-2xl shadow p-8 ${className}`}>
      {children}
    </div>
  );
} 