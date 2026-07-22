'use client';

import React, { useEffect, useState } from 'react';

interface SegmentedPowerMeterProps {
  used: number;
  limit: number;
}

export default function SegmentedPowerMeter({ used, limit }: SegmentedPowerMeterProps) {
  const [mounted, setMounted] = useState(false);
  const segments = 20;
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const percentage = used / limit;
  const activeSegments = Math.round(percentage * segments);
  const isWarning = percentage >= 0.8;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>PWR_CAPACITY</span>
        <span style={{ color: isWarning ? '#ef4444' : 'white', fontWeight: 'bold' }}>{used} / {limit}</span>
      </div>
      <div style={{ display: 'flex', gap: '4px', width: '100%', height: '16px' }}>
        {Array.from({ length: segments }).map((_, i) => {
          const isActive = mounted && i < activeSegments;
          const color = isWarning ? '#ef4444' : '#06b6d4';
          return (
            <div 
              key={i}
              style={{
                flex: 1,
                backgroundColor: isActive ? color : 'rgba(255,255,255,0.05)',
                boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                transform: isActive ? 'skewX(-15deg) scaleY(1.1)' : 'skewX(-15deg)',
                transition: `all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${i * 0.05}s`,
                borderRadius: '1px'
              }}
            />
          );
        })}
      </div>
      {isWarning && (
        <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#ef4444', textTransform: 'uppercase', animation: 'pulse-dot 1s infinite' }}>
          [WARNING] CAPACITY NEAR MAXIMUM
        </div>
      )}
    </div>
  );
}
