"use client";

import { useEffect, useRef, useState } from 'react';

type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
};

const BlurText = ({ 
  text, 
  className = '', 
  delay = 0.1,
  duration = 0.8
}: BlurTextProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={textRef} 
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(8px)',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all ${duration}s cubic-bezier(0.16, 0.77, 0.47, 0.99) $${delay}s`,
        willChange: 'opacity, filter, transform',
      }}
    >
      {text}
    </div>
  );
};

export default BlurText;
