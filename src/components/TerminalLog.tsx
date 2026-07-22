'use client';
import React, { useEffect, useState, useRef } from 'react';
import './TerminalLog.css';

const LOG_MESSAGES = [
  '[SYS_CORE] Initializing NLP arrays...',
  '[AI_NODE] Formatting memory banks...',
  '[NETWORK] Establishing secure uplink...',
  '[MODULE] Loading Tone Engine: Professional',
  '[MODULE] Loading Tone Engine: Witty',
  '[SYS_CORE] Sync complete. Node ready.',
  '[PROCESS] Awaiting payload...',
  '[SCAN] Analyzing local environment...',
  '[AUTH] Token verified.',
  '[METRICS] Heartbeat 45ms. Optimal.',
  '[AI_NODE] Idle.',
];

export default function TerminalLog() {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial logs
    setLogs([LOG_MESSAGES[0], LOG_MESSAGES[1]]);

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
        const updated = [...prev, newLog];
        if (updated.length > 50) updated.shift();
        return updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <aside className="terminal-log-panel">
      <div className="terminal-header">
        <span className="terminal-title">TERMINAL</span>
        <span className="terminal-status-dot"></span>
      </div>
      <div className="terminal-content" ref={containerRef}>
        {logs.map((log, i) => (
          <div key={i} className="log-line">
            <span className="log-timestamp">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
            <span className="log-text">{log}</span>
          </div>
        ))}
        <div className="log-cursor">_</div>
      </div>
      <div className="terminal-footer">
        <div className="scan-line-horizontal"></div>
      </div>
    </aside>
  );
}
