"use client";
import { Icon } from "@iconify/react";
import clsx from "clsx";

export interface LogoLoopProps {
  icons: string[];
  size?: number;
  speed?: number;
  gap?: number;
  reverse?: boolean;
  fadeEdges?: boolean;
  className?: string;
}

export const LogoLoop = ({
  icons,
  size = 28,
  speed = 24,
  gap = 28,
  reverse = false,
  fadeEdges = true,
  className,
}: LogoLoopProps) => {
  const trackStyle: React.CSSProperties = {
    animationDuration: `${speed}s`,
    animationDirection: reverse ? "reverse" : "normal",
    gap: `${gap}px`,
  };

  const iconStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const content = icons.length > 0 ? icons : ["lucide:code"];
  const loopItems = [...content, ...content];

  return (
    <div className={clsx("logo-loop", fadeEdges && "logo-loop--fade", className)}>
      <div className="logo-loop-track" style={trackStyle}>
        {loopItems.map((name, idx) => (
          <Icon
            key={`${name}-${idx}`}
            icon={name}
            style={iconStyle}
            className="shrink-0 text-primary transition-transform duration-200 hover:scale-110"
          />
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
