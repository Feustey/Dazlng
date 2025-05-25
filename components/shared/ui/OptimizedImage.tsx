'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '../../../lib/utils';

interface OptimizedImageProps {
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
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  loading = 'lazy',
  style,
  ...props
}: OptimizedImageProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Générer les sizes par défaut si fill est utilisé mais sizes non fourni
  const defaultSizes = fill && !sizes 
    ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    : sizes;

  // Génération d'un placeholder blur simple si non fourni
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        style={{ width: !fill ? width : undefined, height: !fill ? height : undefined, ...style }}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  // Configuration de base pour Next/Image
  const imageProps = {
    src,
    alt,
    priority,
    quality,
    placeholder,
    blurDataURL: blurDataURL || defaultBlurDataURL,
    className: cn(
      'duration-700 ease-in-out',
      isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
      className
    ),
    onLoad: () => setIsLoading(false),
    onError: () => setHasError(true),
    style,
    ...props,
  };

  if (fill) {
    return (
      <div className="relative overflow-hidden w-full h-full">
        <Image
          {...imageProps}
          fill
          sizes={defaultSizes}
          alt={alt}
          // Ne pas passer loading si priority est défini (conflit entre les deux)
          loading={priority ? undefined : loading}
        />
        
        {/* Skeleton loader pendant le chargement */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
    );
  }

  // Mode normal avec width/height
  return (
    <div className="relative overflow-hidden">
      <Image
        {...imageProps}
        width={width}
        height={height}
        sizes={defaultSizes}
        alt={alt}
        // Ne pas passer loading si priority est défini (conflit entre les deux)
        loading={priority ? undefined : loading}
      />
      
      {/* Skeleton loader pendant le chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
} 