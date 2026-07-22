"use client";
import React, { useRef, useState } from "react";

export default function InteractiveCard({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setPosition({ x, y });
    
    // Calculate 3D tilt
    const tiltX = (y / height - 0.5) * -10; 
    const tiltY = (x / width - 0.5) * 10;
    
    ref.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div
      ref={ref}
      className={`interactive-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        position: 'relative',
        transition: isHovered ? 'none' : 'transform 0.5s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      <div 
        className="card-spotlight"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(124, 58, 237, 0.15), transparent 40%)`,
        }}
      />
      <div className="card-content-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
