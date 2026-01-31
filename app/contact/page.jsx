"use client";

import React from "react";

export default function ContactPage() {
  return (
    <div className="w-full">
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 px-[5%] py-20 md:py-28 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary blur-[120px]" />
          <div className="absolute -right-10 bottom-10 h-80 w-80 rounded-full bg-blue-500 blur-[140px]" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-3xl text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">
            Let’s talk ideas that matter
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Send us your inquiry and we’ll respond within 1–2 business days.
          </p>
        </div>
      </section>

      <section className="w-full bg-white px-[5%] py-16 md:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-2xl border border-border-primary/40 bg-white p-6 shadow-lg md:p-10">
            <h2 className="text-2xl font-bold md:text-3xl">Send an inquiry</h2>
            <p className="mt-2 text-muted-foreground">
              One simple form for all questions, press, or partnership requests.
            </p>

            <form className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  className="w-full rounded-lg border border-border-primary bg-white px-4 py-3 text-sm"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full rounded-lg border border-border-primary bg-white px-4 py-3 text-sm"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full rounded-lg border border-border-primary bg-white px-4 py-3 text-sm"
              />
              <textarea
                name="message"
                placeholder="Your message"
                className="min-h-[160px] w-full rounded-lg border border-border-primary bg-white px-4 py-3 text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90"
              >
                Send inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

