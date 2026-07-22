"use client";
import React, { useState, useEffect, useRef } from "react";

const CHARS = "!@#$%^&*()_+{}|:<>?~1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleText({ text, className = "" }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          scramble();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const scramble = () => {
    let iteration = 0;
    const maxIterations = text.length;
    
    const interval = setInterval(() => {
      setDisplayText((prev) => 
        text.split("").map((letter, index) => {
          if (letter === " ") return " ";
          if (index < iteration) {
            return text[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      
      if (iteration >= maxIterations) {
        clearInterval(interval);
      }
      iteration += 1/3;
    }, 30);
  };

  return (
    <span ref={ref} className={className}>
      {hasAnimated ? displayText : text.replace(/[^\s]/g, "\u00A0")}
    </span>
  );
}
