'use client';
import React, { useRef, useEffect, useState } from 'react';
import './TabGroup.css';

export interface Tab {
  key: string;
  label: string;
  icon?: string;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
}

export default function TabGroup({ tabs, activeTab, onChange }: TabGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(`[data-active="true"]`) as HTMLElement;
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="tab-group" ref={containerRef}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          data-active={activeTab === tab.key}
          onClick={() => onChange(tab.key)}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
      <div 
        className="tab-indicator"
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
    </div>
  );
}
