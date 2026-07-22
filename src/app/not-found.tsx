import React from 'react';
import Link from 'next/link';
import MagneticButton from '@/components/effects/MagneticButton';
import ScrambleText from '@/components/effects/ScrambleText';
import './legal.css'; // Reuse legal layout structure

export const metadata = {
  title: 'Page Not Found | Splinter',
};

export default function NotFoundPage() {
  return (
    <div className="legal-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="legal-content glass p-12" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="gradient-text" style={{ fontSize: '6rem', marginBottom: '8px' }}>
          <ScrambleText text="404" />
        </h1>
        <h2 style={{ marginTop: '0', fontSize: '2rem' }}>Fragment Lost in the Void</h2>
        
        <p style={{ fontSize: '1.1rem', marginBottom: '32px' }}>
          The page you're looking for has been deleted, moved, or never existed in the first place. Let's get you back to safety.
        </p>

        <MagneticButton href="/" className="splinter-btn splinter-btn--primary splinter-btn--lg">
          Return to Base
        </MagneticButton>
      </div>
    </div>
  );
}
