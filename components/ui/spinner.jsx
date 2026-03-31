import * as React from "react";
import { cn } from "@/lib_/utils";

export function Spinner({ className, ...props }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent",
        className
      )}
      {...props}
    />
  );
}

