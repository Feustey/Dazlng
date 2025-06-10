import React, { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps): React.ReactElement {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {title && (
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
} 