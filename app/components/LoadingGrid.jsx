"use client";

import React from "react";

export default function LoadingGrid({ columns = 3, rows = 2, height = "12rem" }) {
  const items = Array.from({ length: columns * rows });
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((_, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-2xl border border-border-primary/30 bg-gradient-to-br from-background-secondary via-background-secondary/80 to-background-secondary p-4 shadow-sm"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ animation: "shimmer 1.4s infinite" }}
          />
          <div
            className="mb-4 w-full rounded-xl bg-muted/80 animate-pulse"
            style={{ height }}
          />
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-muted/80 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-muted/70 animate-pulse" />
            <div className="h-3 w-full rounded bg-muted/70 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-muted/60 animate-pulse" />
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-muted/60" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-muted/60 delay-150" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-muted/60 delay-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
