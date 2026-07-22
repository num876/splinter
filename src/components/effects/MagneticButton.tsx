"use client";
import React, { useRef } from "react";
import Link from "next/link";

interface Props {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function MagneticButton({ href, children, className = "", onClick }: Props) {
  const ref = useRef<HTMLDivElement | HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.3;
    const y = (e.clientY - (top + height / 2)) * 0.3;
    
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
    ref.current.style.transition = "none";
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `translate(0px, 0px)`;
    ref.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
  };

  const style: React.CSSProperties = {
    transform: "translate(0px, 0px)",
    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    display: "inline-block"
  };

  if (href) {
    return (
      <Link 
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={style}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
