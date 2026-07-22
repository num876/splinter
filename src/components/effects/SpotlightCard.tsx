'use client';

import React, { useRef, useState } from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(124, 58, 237, 0.15)', // Default purple accent
  ...props 
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    div.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    div.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{ '--spotlight-color': spotlightColor } as React.CSSProperties}
      {...props}
    >
      <div
        className="spotlight-effect"
        style={{
          opacity
        }}
      />
      {children}
    </div>
  );
}
