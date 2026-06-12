"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React/Next -----
import { JSX } from "react";
// ----- Utils -----
import { cn } from "@/lib/utils";
// ----- Types -----
import { LoadingProps } from "@/types";

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
  xl: "h-16 w-16 border-4",
};

/**
 * Loading Component
 * @description Loading Component
 * @returns JSX.Element - Loading Component
 */
export function Loading({
  size = "md",
  variant = "spinner",
  fullScreen = false,
  text,
  className,
}: LoadingProps): JSX.Element {
  const content = () => {
    switch (variant) {
      case "spinner":
        return (
          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className={cn(
                "animate-spin rounded-full border-primary border-t-transparent",
                sizeClasses[size],
                className,
              )}
            />
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
          </div>
        );
      case "skeleton":
        return (
          <div className={cn("w-full space-y-3", className)}>
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-11/12 bg-muted rounded animate-pulse" />
            <div className="h-4 w-9/12 bg-muted rounded animate-pulse" />
          </div>
        );
      case "dots":
        return (
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-primary animate-bounce",
                  size === "sm" && "h-1 w-1",
                  size === "md" && "h-2 w-2",
                  size === "lg" && "h-3 w-3",
                  size === "xl" && "h-4 w-4",
                )}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
            {text && (
              <span className="ml-2 text-sm text-muted-foreground">{text}</span>
            )}
          </div>
        );
      case "pulse":
        return (
          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className={cn(
                "rounded-full bg-primary/50 animate-pulse",
                size === "sm" && "h-4 w-4",
                size === "md" && "h-8 w-8",
                size === "lg" && "h-12 w-12",
                size === "xl" && "h-16 w-16",
              )}
            />
            {text && (
              <p className="text-sm text-muted-foreground animate-pulse">
                {text}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content()}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">{content()}</div>
  );
}
