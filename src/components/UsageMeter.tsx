import React, { useEffect, useState } from 'react';
import './UsageMeter.css';

interface UsageMeterProps {
  used: number;
  limit: number;
}

export default function UsageMeter({ used, limit }: UsageMeterProps) {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    // Animate on mount
    const timeout = setTimeout(() => {
      setFill((used / limit) * 100);
    }, 100);
    return () => clearTimeout(timeout);
  }, [used, limit]);

  const percentage = (used / limit) * 100;
  let statusClass = 'low';
  if (percentage >= 90) statusClass = 'critical';
  else if (percentage >= 60) statusClass = 'warning';

  return (
    <div className="usage-meter-container">
      <div className="usage-meter-header">
        <span className="usage-meter-text">{used} / {limit} splinters used</span>
      </div>
      <div className="usage-meter-track">
        <div 
          className={`usage-meter-fill ${statusClass}`}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
}
