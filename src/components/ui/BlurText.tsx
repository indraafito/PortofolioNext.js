"use client";

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
};

const BlurText = ({ 
  text, 
  className = '', 
  delay = 0.1,
  duration = 0.8,
  stagger = 0.02
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

  const letters = text.split('');

  return (
    <div ref={textRef} className={`flex flex-wrap ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ 
            opacity: 0, 
            filter: 'blur(8px)',
            y: 20
          }}
          animate={isVisible ? { 
            opacity: 1, 
            filter: 'blur(0px)',
            y: 0
          } : {}}
          transition={{ 
            delay: delay + (index * stagger),
            duration,
            ease: [0.16, 0.77, 0.47, 0.99]
          }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;
