"use server";

import React from "react";
import Header69 from "../components/Header69.jsx";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchEvents() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/events?limit=50`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.events || data || [];
}

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <div>
      <Header69
        imageUrl="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2100&h=900&q=80"
        title="Upcoming Events"
        subtitle="Stay current with CAP events, talks, and community gatherings."
      />
      <section className="px-[5%] py-12 md:py-16 lg:py-20 bg-background-secondary">
        <div className="container">
          <div className="mb-8 md:mb-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Events
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">Upcoming events</h1>
              <p className="mt-1 text-muted-foreground md:text-md">
                Sorted by date, soonest first.
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {events.length} scheduled
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-xl border border-border-primary bg-background-primary/90 p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
                  <span>{new Date(ev.date).toLocaleDateString()}</span>
                  <span>{ev.time}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold">{ev.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                  {ev.description}
                </p>
                {ev.location && (
                  <p className="mt-3 text-sm font-semibold text-primary">
                    {ev.location}
                  </p>
                )}
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No upcoming events.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

