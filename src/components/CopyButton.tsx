'use client';

import React, { useState } from 'react';
import './CopyButton.css';

export interface CopyButtonProps {
  textToCopy?: string;
  text?: string;
  className?: string;
}

export function CopyButton({ textToCopy, text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const content = textToCopy || text || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <button 
      className={`splinter-copy-btn ${copied ? 'splinter-copy-btn--success' : ''} ${className}`}
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="splinter-copy-btn__icon splinter-copy-btn__icon--check" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="splinter-copy-btn__icon splinter-copy-btn__icon--copy" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

export default CopyButton;

