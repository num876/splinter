import React, { HTMLAttributes, ReactNode } from 'react';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'md',
  ...props
}: CardProps) {
  const classes = [
    'splinter-card',
    `splinter-card--p-${padding}`,
    hover ? 'splinter-card--hover' : '',
    glow ? 'splinter-card--glow' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="splinter-card__content">
        {children}
      </div>
      {glow && <div className="splinter-card__glow-bg" />}
    </div>
  );
}
