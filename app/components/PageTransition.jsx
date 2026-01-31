"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = useMemo(
    () => `${pathname}?${searchParams?.toString() || ""}`,
    [pathname, searchParams]
  );
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 180);
    return () => clearTimeout(timer);
  }, [key]);

  if (!isVisible) {
    return <div className="min-h-[40vh]" aria-hidden="true" />;
  }

  return (
    <div key={key} className="animate-page-fade">
      {children}
    </div>
  );
}

