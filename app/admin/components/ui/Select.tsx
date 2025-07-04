import { ReactNode } from "react";

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface SelectValueProps {
  placeholder?: string;
  children?: ReactNode;
}

export interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export interface SelectItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

export function Select({ 
  value, 
  onValueChange, 
  children, 
  className = "",
  placeholder,
  disabled = false
}: SelectProps): JSX.Element {
  return (
    <div className={className}>
      <select 
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </div>
  );
}

export function SelectTrigger({ children, className = "", onClick }: SelectTriggerProps): JSX.Element {
  return (
    <div 
      className={`cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder, children }: SelectValueProps): JSX.Element {
  return <span>{children || placeholder}</span>;
}

export function SelectContent({ children, className = "" }: SelectContentProps): JSX.Element {
  return (
    <div className={`absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function SelectItem({ value, children, disabled = false }: SelectItemProps): JSX.Element {
  return (
    <option value={value} disabled={disabled}>
      {children}
    </option>
  );
}