import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", text, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6", 
      lg: "w-8 h-8"
    };

    return (
      <div 
        ref={ref} 
        role="status" aria-live="polite" className={cn("flex flex-col items-center justify-center gap-3 text-primary", className)}
        {...props}
      >
        <div 
          className={cn(
            "animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
            sizeClasses[size]
          )}
        />
        {text && (
          <p className="text-white/80 text-sm font-medium">
            {text}
          </p>
        )}
      </div>
    );
  }
);
LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
