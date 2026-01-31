"use server";

import React from "react";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchEvents(limit = 3) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/events?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.events || data || [];
}

export default async function EventsSection() {
  const events = await fetchEvents(3);
  return (
    <section className="relative overflow-hidden border-b border-border-primary bg-gradient-to-r from-background-secondary via-background-primary to-background-secondary px-[5%] py-6 md:py-8">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-10 top-0 h-24 w-24 rounded-full bg-primary blur-[60px]" />
        <div className="absolute right-10 bottom-0 h-28 w-28 rounded-full bg-blue-500 blur-[70px]" />
      </div>
      <div className="container relative z-10 max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Upcoming events
            </p>
            <h2 className="text-xl font-bold md:text-2xl">
              What’s happening soon
            </h2>
            <p className="text-xs text-muted-foreground">
              Quick highlights from CAP’s calendar.
            </p>
          </div>
          <a
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-background-primary px-4 py-2 text-xs font-semibold text-primary shadow-sm hover:bg-background-secondary"
          >
            View all events
            <span aria-hidden>→</span>
          </a>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="group rounded-xl border border-border-primary/50 bg-background-primary/90 p-3 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-muted-foreground">
                <span>{new Date(ev.date).toLocaleDateString()}</span>
                <span>{ev.time}</span>
              </div>
              <h3 className="mt-1 text-sm font-bold line-clamp-2">
                {ev.title}
              </h3>
              <p className="text-[12px] text-muted-foreground line-clamp-2">
                {ev.description}
              </p>
              {ev.location && (
                <p className="mt-2 text-[11px] font-semibold text-primary">
                  {ev.location}
                </p>
              )}
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground">No upcoming events.</p>
          )}
        </div>
      </div>
    </section>
  );
}

