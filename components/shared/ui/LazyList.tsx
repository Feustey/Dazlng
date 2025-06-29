'use client';

import React from 'react';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../../lib/utils';

interface LazyListProps<T> {
  items: T[];
  pageSize?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  className?: string;
  overscan?: number;
  estimateSize?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export function LazyList<T>({
  items,
  pageSize = 10,
  renderItem,
  loadingComponent,
  emptyComponent,
  className = '',
  overscan = 5,
  estimateSize = 50,
  onEndReached,
  endReachedThreshold = 0.8
}: LazyListProps<T>) {
  const [displayCount, setDisplayCount] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);
  
  // Référence au conteneur de la liste
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Observer pour détecter la fin de la liste
  const { ref: endRef, inView } = useInView({
    threshold: endReachedThreshold
  });

  // Virtualisation pour optimiser le rendu
  const virtualizer = useVirtualizer({
    count: Math.min(displayCount, items.length),
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan
  });

  // Gérer le chargement de plus d'éléments
  const loadMore = useCallback(async () => {
    if (isLoading || displayCount >= items.length) return;
    
    setIsLoading(true);
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setDisplayCount(prev => Math.min(prev + pageSize, items.length));
      
      if (onEndReached && displayCount + pageSize >= items.length) {
        onEndReached();
      }
    } finally {
      setIsLoading(false);
    }
  }, [displayCount, isLoading, items.length, onEndReached, pageSize]);

  // Charger plus d'éléments quand on atteint la fin
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  // Optimisation du rendu
  const getItemKey = useCallback((index: number) => {
    const item = items[index];
    return (item as any).id || index;
  }, [items]);

  if (!items.length && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return (
    <div 
      ref={parentRef}
      className={`relative overflow-auto ${className}`}
      style={{ height: '100%', maxHeight: '80vh' }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize() + 'px',
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem: any) => {
          const item = items[virtualItem.index];
          return (
            <div
              key={getItemKey(virtualItem.index)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size + 'px',
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
  );
        })}
      </div>

      {/* Indicateur de chargement */}
      {isLoading && loadingComponent && (
        <div className="py-4">
          {loadingComponent}
        </div>
      )}

      {/* Élément observé pour détecter la fin */}
      <div ref={endRef} className="h-px" />
    </div>
  );
}
