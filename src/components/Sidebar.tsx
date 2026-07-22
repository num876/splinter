'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/auth/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: '📊' },
    { name: 'My Splinters', path: '/dashboard/splinters', icon: '⚡' },
    { name: 'Billing', path: '/dashboard/billing', icon: '💳' },
    { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
  ];

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="sidebar-logo">
            <img src="/logo.jpg" alt="Splinter" className="logo-mark" />
            <span className="logo-text gradient-text">Splinter</span>
          </Link>
          {onClose && (
            <button className="mobile-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
        </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{displayName[0]?.toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">
              {displayName}
              <span className="plan-badge">FREE</span>
            </span>
            <span className="user-email">{user?.email || 'user@example.com'}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
    </>
  );
}
