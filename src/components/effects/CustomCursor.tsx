'use client';

import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const mousePosition = useRef({ x: 0, y: 0 });

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHoverSupported, setIsHoverSupported] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(hover: none)").matches) {
      setIsHoverSupported(false);
      return;
    }

    const updateCursorPosition = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePosition.current.x}px, ${mousePosition.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${mousePosition.current.x}px, ${mousePosition.current.y}px)`;
      }
      requestRef.current = requestAnimationFrame(updateCursorPosition);
    };
    requestRef.current = requestAnimationFrame(updateCursorPosition);

    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousemove', checkHover);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseenter', onMouseEnter);

    document.body.style.cursor = 'none';
    const interactiveElements = document.querySelectorAll('a, button, input, textarea');
    interactiveElements.forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', checkHover);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
      document.body.style.cursor = 'auto';
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!mounted || !isHoverSupported) return null;

  return (
    <>
      <div 
        ref={dotRef}
        className={`custom-cursor-dot ${isVisible ? 'visible' : ''} ${isHovering ? 'hover' : ''}`}
        style={{ left: 0, top: 0 }}
      />
      <div 
        ref={ringRef}
        className={`custom-cursor-ring ${isVisible ? 'visible' : ''} ${isHovering ? 'hover' : ''}`}
        style={{ left: 0, top: 0 }}
      />
    </>
  );
}
