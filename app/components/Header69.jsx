"use client";

import React from "react";

export default function Header69({
  imageUrl = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  title = "Short heading",
  subtitle = "Add your caption here for this page.",
}) {
  return (
    <section
      id="relume"
      className="relative overflow-hidden px-[5%] py-16 md:py-24 lg:py-28 min-h-[100vh] md:min-h-[85vh] flex items-center"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src={imageUrl}
          className="h-full w-full min-h-full object-cover object-center"
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/35 to-black/50" />
      </div>
      <div className="container relative z-10 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-white md:mb-5 md:text-6xl lg:text-7xl leading-tight">
          {title}
        </h1>
        <p className="text-white/90 text-lg md:text-xl">{subtitle}</p>
      </div>
    </section>
  );
}
