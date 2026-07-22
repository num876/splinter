import React from 'react';
import { OutputFormat, FORMAT_LABELS, FORMAT_ICONS } from '@/lib/types';
import './FormatBadge.css';

interface FormatBadgeProps {
  format: OutputFormat;
}

export default function FormatBadge({ format }: FormatBadgeProps) {
  return (
    <span className={`format-badge format-badge-${format}`}>
      <span className="format-icon">{FORMAT_ICONS[format]}</span>
      <span className="format-label">{FORMAT_LABELS[format]}</span>
    </span>
  );
}
