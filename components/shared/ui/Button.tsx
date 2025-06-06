import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'default';
  size?: 'small' | 'medium' | 'large' | 'sm';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button(props: ButtonProps): React.ReactElement {
  const {
    children,
    onClick,
    disabled = false,
    loading = false,
    variant = 'primary',
    size = 'medium',
    type = 'button',
    className = '',
  } = props;

  const base = 'rounded-[25px] flex items-center justify-center shadow-md transition-colors duration-200 font-semibold';
  const variants: Record<string, string> = {
    primary: 'bg-secondary text-primary',
    secondary: 'bg-background border-2 border-secondary text-secondary',
    outline: 'bg-transparent border-2 border-secondary text-secondary',
    default: 'bg-blue-600 text-white hover:bg-blue-700',
  };
  const sizes: Record<string, string> = {
    small: 'py-2 px-6 text-[15px]',
    sm: 'py-2 px-4 text-sm',
    medium: 'py-3 px-7 text-[18px]',
    large: 'py-4 px-9 text-[22px]',
  };
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-85 active:scale-97';

  return (
    <button
      type={type}
      className={[
        base,
        variants[variant],
        sizes[size],
        disabledClass,
        loading ? 'pointer-events-none' : '',
        className,
      ].join(' ')}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span className="flex flex-row items-center gap-2">
        {loading && (
          <svg className="animate-spin h-5 w-5 text-inherit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
        )}
        <span>{children}</span>
      </span>
    </button>
  );
} 