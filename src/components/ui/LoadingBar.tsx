import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  showText?: boolean;
}

const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>(
  ({ className, progress = 30, showText = false, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("w-full flex flex-col items-center gap-2", className)}
        {...props}
      >
        <div className="h-1 w-full rounded-full overflow-hidden bg-white/10">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              animation: progress === 30 ? "loading-progress 1.8s ease-in-out infinite" : "none"
            }}
          />
        </div>
        {showText && (
          <p className="text-white/60 text-xs">
            {progress}%
          </p>
        )}
      </div>
    );
  }
);
LoadingBar.displayName = "LoadingBar";

export { LoadingBar };
