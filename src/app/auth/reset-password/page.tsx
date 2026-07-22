'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import '../auth.css';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-strong">
        <div className="auth-header">
          <Link href="/" className="auth-logo">Splinter</Link>
          <h2>Reset Password</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message" style={{ color: 'var(--success-bg, #10b981)', background: 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>{message}</div>}

        <form onSubmit={handleReset} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" className="primary-btn full-width" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Remembered your password? <Link href="/auth/login" className="auth-link">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}
