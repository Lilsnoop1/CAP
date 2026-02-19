"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export default function Cta27() {
  return (
    <section
      id="relume"
      className="relative overflow-hidden px-[5%] py-16 md:py-24 lg:py-28 min-h-[100vh] md:min-h-[85vh] flex items-center"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          className="h-full w-full min-h-full object-cover object-center"
          alt="People in discussion representing community and conversation"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-black/45 via-black/35 to-black/55" />
      </div>
      <div className="container relative z-10 max-w-lg text-center w-full">
        <h2 className="rb-5 mb-5 text-5xl font-bold text-white md:mb-6 md:text-7xl lg:text-8xl">
          Keep the conversation going
        </h2>
        <p className="text-white/90 text-lg md:text-xl">
          Share your thoughts, challenge our ideas, or discover what others are
          reading right now
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
    </section>
  );
}
