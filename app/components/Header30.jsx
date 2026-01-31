"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export default function Header30() {
  return (
    <section
      id="relume"
      className="relative overflow-hidden px-[5%] min-h-[100vh] md:min-h-[90vh]"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2070&q=80"
          className="h-full w-full min-h-full object-cover object-center"
          alt="Team collaboration representing CAP's mission"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50" />
      </div>
      <div className="container relative z-10">
        <div className="flex max-h-[70rem] min-h-[100vh] items-center justify-center py-16 text-center md:min-h-[90vh] md:py-24 lg:py-28">
          <div className="w-full max-w-lg">
            <h1 className="mb-5 text-6xl font-bold text-white md:mb-6 md:text-8xl lg:text-10xl">
              Think differently, see further
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-md mx-auto">
              Challenging conventional wisdom to shape tomorrow.
            </p>
            <div className="mt-6 flex items-center justify-center md:mt-8">
              <Button
                title="Explore"
                className="bg-white text-black hover:bg-white/90"
                asChild
              >
                <a href="/trending-articles">Explore</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
