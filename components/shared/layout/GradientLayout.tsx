import React from "react";

export interface GradientLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const GradientLayout: React.FC<GradientLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 ${className}`}>
      {children}
    </div>
  );
};

export default GradientLayout;