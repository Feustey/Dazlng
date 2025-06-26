'use client';

import React from 'react';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { cn } from '../../../lib/utils';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  loading = 'lazy',
  style,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Générer les sizes par défaut si fill est utilisé mais sizes non fourni
  const defaultSizes = fill && !sizes 
    ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    : sizes;

  // Placeholder blur par défaut si non fourni
  const defaultBlurDataURL = blurDataURL || `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==`;

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);

  // Affichage d'erreur avec placeholder SVG
  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden',
          className
        )}
        style={{ 
          width: !fill ? width : undefined, 
          height: !fill ? height : undefined, 
          ...style 
        }}
      >
        <svg 
          width={width || 400} 
          height={height || 300} 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dy=".3em" 
            fill="#9ca3af" 
            fontFamily="system-ui, sans-serif" 
            fontSize="14"
          >
            Image non disponible
          </text>
        </svg>
      </div>
  );
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        isLoading && 'animate-pulse bg-gray-200',
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
        sizes={defaultSizes}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300 object-cover',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        style={style}
        {...props}
      />
      
      {/* Skeleton loader pendant le chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
    </div>
  );
}
