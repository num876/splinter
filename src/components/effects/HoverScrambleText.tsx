'use client';
import React, { useState, useRef, useEffect } from "react";

const CHARS = "!@#$%^&*()_+{}|:<>?~1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function HoverScrambleText({ text, className = "" }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    let iteration = 0;
    const maxIterations = text.length;
    
    intervalRef.current = setInterval(() => {
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
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }
      iteration += 1/3;
    }, 30);
  };

  const handleMouseEnter = () => {
    scramble();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span className={className} onMouseEnter={handleMouseEnter}>
      {displayText}
    </span>
  );
}
