"use client";
import React, { ReactNode, useEffect, useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Délai minimal pour éviter le flash
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden ${
      withGradientBg 
        ? 'bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800' 
        : 'bg-white'
    } ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      
      {/* Cercles animés optimisés pour le GPU */}
      {withAnimatedCircles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float top-[-20%] left-[-20%]"
            style={{ 
              willChange: 'transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          />
          <div 
            className="absolute w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-float-delayed right-[-20%] bottom-[-20%]"
            style={{ 
              willChange: 'transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          />
        </div>
      )}
      
      {/* Contenu principal avec z-index optimisé */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default ModernLayout; 