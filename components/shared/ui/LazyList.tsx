'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../../../lib/utils';

interface LazyListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  pageSize?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  threshold?: number;
}

export function LazyList<T>({
  items,
  renderItem,
  pageSize = 20,
  className,
  loadingComponent,
  emptyComponent,
  threshold = 200
}: LazyListProps<T>): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Éléments visibles actuellement
  const visibleItems = useMemo(() => {
    return items.slice(0, currentPage * pageSize);
  }, [items, currentPage, pageSize]);

  // Détection du scroll pour charger plus d'éléments
  const handleScroll = useCallback(() => {
    if (isLoading || visibleItems.length >= items.length) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;

    if (scrollTop + windowHeight >= documentHeight - threshold) {
      setIsLoading(true);
      // Simulation d'un délai de chargement
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoading(false);
      }, 100);
    }
  }, [isLoading, visibleItems.length, items.length, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (items.length === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        {emptyComponent || <p className="text-gray-500">Aucun élément à afficher</p>}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {visibleItems.map((item, index) => (
        <div key={index} className="animate-in fade-in duration-300">
          {renderItem(item, index)}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          {loadingComponent || (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-150"></div>
            </div>
          )}
        </div>
      )}
      
      {visibleItems.length >= items.length && items.length > pageSize && (
        <div className="text-center p-4 text-gray-500">
          Tous les éléments ont été chargés
        </div>
      )}
    </div>
  );
} 