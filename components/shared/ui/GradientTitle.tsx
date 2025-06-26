import React from 'react';

export interface GradientTitleProps {
  children: React.ReactNode;
  className?: string;
}

const GradientTitle: React.FC<GradientTitleProps> = ({ children, className = "" }) => {
  return (
    <h1 className={`text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-orange-400 via-yellow-300 to-pink-500 bg-clip-text text-transparent ${className}`}>
      {children}
    </h1>
  );
};

export default GradientTitle; 