"use client";
import React, { ReactNode } from "react";
// import { usePathname } from "next/navigation";

export interface ModernLayoutProps {
  children: ReactNode;
  withGradientBg?: boolean;
  withAnimatedCircles?: boolean;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ 
  children, 
  withGradientBg = true,
  withAnimatedCircles = true 
}) => {
  return (
    <div className={`relative min-h-screen ${withGradientBg ? 'bg-gradient-to-br from-indigo-600 to-purple-700' : ''}`}>
      {/* Cercles animés en arrière-plan */}
      {withAnimatedCircles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl animate-float top-[-20%] left-[-20%]" />
          <div className="absolute w-96 h-96 bg-indigo-400 rounded-full opacity-10 blur-3xl animate-float-delayed right-[-20%] bottom-[-20%]" />
        </div>
      )}
      {/* Contenu principal */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
};
};

export default ModernLayout; 