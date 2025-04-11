"use client";

import React, { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  fullWidth?: boolean;
}

export default function PageContainer({
  children,
  title,
  subtitle,
  className = "",
  fullWidth = false,
}: PageContainerProps) {
  return (
    <div className="relative min-h-screen pt-[80px]">
      {/* Fond avec dégradé et effet de grain */}
      <div className="absolute inset-0 hero-gradient">
        <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10">
        {(title || subtitle) && (
          <div className="container mx-auto px-4 py-12 text-center">
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                <span className="text-gradient">{title}</span>
              </h1>
            )}
            {subtitle && (
              <p className="text-xl text-gray-300 animate-slide-up max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div
          className={`${
            fullWidth ? "" : "container mx-auto px-4"
          } ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
