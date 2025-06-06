import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps): React.ReactElement {
  return (
    <div className={`bg-white rounded-2xl shadow p-8 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardHeaderProps): React.ReactElement {
  return (
    <div className={`pb-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: CardTitleProps): React.ReactElement {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "" }: CardContentProps): React.ReactElement {
  return (
    <div className={`pt-4 ${className}`}>
      {children}
    </div>
  );
} 