import React from 'react';

interface GradientLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const GradientLayout: React.FC<GradientLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 ${className}`}>
      {children}
    </div>
  );
};

export default GradientLayout; 