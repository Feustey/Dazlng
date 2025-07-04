"use client";
import React, { ReactNode, useEffect, useState } from "react";
// import { usePathname } from \next/navigatio\n";

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
    <div>
      {/* Cercles animés optimisés pour le GPU  */}
      {withAnimatedCircles && (
        <div>
          <div></div>
          <div></div>
        </div>
      )}
      
      {/* Contenu principal avec z-index optimisé  */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default ModernLayout;