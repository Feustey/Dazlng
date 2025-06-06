import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'warning' | 'error' | 'success';
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function Alert({ 
  children, 
  variant = 'default', 
  className = '' 
}: AlertProps): React.ReactElement {
  const baseClasses = 'rounded-lg border p-4';
  
  const variants = {
    default: 'border-blue-200 bg-blue-50 text-blue-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    success: 'border-green-200 bg-green-50 text-green-800'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function AlertDescription({ 
  children, 
  className = '' 
}: AlertDescriptionProps): React.ReactElement {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
}

export default Alert; 