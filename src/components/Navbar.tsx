"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide navbar on dashboard, auth, and splinter pages (they use the Sidebar)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/auth') || pathname.startsWith('/splinter')) {
    return null;
  }

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link href="/" className="logo">
          <img src="/logo.jpg" alt="Splinter" className="logo-mark" />
          <span className="logo-text">Splinter</span>
        </Link>

        <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          
          <div className="nav-actions-mobile">
            <Link href="/auth/login" className="btn btn-ghost">Login</Link>
            <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
          </div>
        </div>

        <div className="nav-actions-desktop">
          <Link href="/auth/login" className="btn btn-ghost">Login</Link>
          <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
        </div>

        <button 
          className="mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}
