"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib_/utils";

export const adminPortalButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-tight",
    "transition-all duration-150 outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none",
    "cursor-pointer active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-black/15 shadow-md hover:bg-primary/92 hover:shadow-lg hover:border-black/25",
        secondary:
          "bg-background-primary text-foreground border-2 border-[var(--border-primary)] shadow-sm hover:bg-background-secondary hover:border-primary hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground border border-red-950/25 shadow-md hover:bg-destructive/88 hover:shadow-lg",
        ghost:
          "bg-transparent text-foreground border-2 border-transparent shadow-none hover:border-[var(--border-primary)] hover:bg-muted/70 hover:shadow-sm",
        outline:
          "bg-background-primary text-primary border-2 border-primary shadow-sm hover:bg-primary hover:text-primary-foreground hover:shadow-md",
      },
      size: {
        xs: "h-8 min-h-8 px-2.5 text-xs rounded-md gap-1 [&_svg]:size-3.5",
        sm: "h-9 min-h-9 px-3 text-sm rounded-md [&_svg]:size-4",
        md: "h-10 min-h-10 px-4 text-sm rounded-lg [&_svg]:size-4",
        lg: "h-11 min-h-11 px-6 text-base rounded-lg [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

/** Shared pill styling for admin tab triggers (use with TabsTrigger className). */
export const ADMIN_TAB_TRIGGER_CLASS =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg border-2 border-[var(--border-primary)] bg-background-primary px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/60 hover:shadow-md data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md";

export const AdminPortalButton = React.forwardRef(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(adminPortalButtonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
AdminPortalButton.displayName = "AdminPortalButton";
