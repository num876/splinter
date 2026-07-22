'use client';

import React, { useEffect, useState } from 'react';

interface DataDialProps {
  value: number;
  label: string;
  icon: string;
  color?: string;
  max?: number;
  delay?: number;
}

export default function DataDial({ value, label, icon, color = '#06b6d4', max = 100, delay = 0 }: DataDialProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(Math.min((value / max) * 100, 100));
    }, delay);
    return () => clearTimeout(timer);
  }, [value, max, delay]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="data-dial-container" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div className="dial-wrapper" style={{ position: 'relative', width: '80px', height: '80px' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="40" cy="40" r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          />
          <circle
            cx="40" cy="40" r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', textShadow: `0 0 10px ${color}` }}>
          {icon}
        </div>
      </div>
      <div className="dial-info">
        <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Clash Display', color: 'white', textShadow: `0 0 15px ${color}40` }}>
          {value}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {label}
        </div>
      </div>
    </div>
  );
}
