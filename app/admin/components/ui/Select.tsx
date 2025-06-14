import { ReactNode } from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface SelectTriggerProps {
  children: ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: ReactNode;
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export function Select({ value, onValueChange, children, className = "" }: SelectProps): JSX.Element {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
      >
        {children}
      </select>
    </div>
  );
}

export function SelectTrigger({ children }: SelectTriggerProps): JSX.Element {
  return <>{children}</>;
}

export function SelectValue({ placeholder }: SelectValueProps): JSX.Element {
  return <>{placeholder}</>;
}

export function SelectContent({ children }: SelectContentProps): JSX.Element {
  return <>{children}</>;
}

export function SelectItem({ value, children }: SelectItemProps): JSX.Element {
  return <option value={value}>{children}</option>;
}