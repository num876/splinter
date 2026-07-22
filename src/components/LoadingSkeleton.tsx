import React from 'react';
import './LoadingSkeleton.css';

export interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-md)',
  lines = 1,
  className = ''
}: LoadingSkeletonProps) {
  if (lines > 1) {
    return (
      <div className={`splinter-skeleton-group ${className}`} style={{ gap: '8px', display: 'flex', flexDirection: 'column' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className="splinter-skeleton"
            style={{ 
              width: i === lines - 1 ? '70%' : width, 
              height, 
              borderRadius 
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`splinter-skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}
