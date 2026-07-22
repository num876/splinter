'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    'splinter-btn',
    `splinter-btn--${variant}`,
    `splinter-btn--${size}`,
    fullWidth ? 'splinter-btn--full' : '',
    loading ? 'splinter-btn--loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="splinter-btn__spinner">
          <svg className="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.4" strokeDashoffset="0"></circle>
          </svg>
        </span>
      )}
      {!loading && icon && <span className="splinter-btn__icon">{icon}</span>}
      <span className="splinter-btn__text">{children}</span>
    </button>
  );
}
