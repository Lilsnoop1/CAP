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
    <section className="border-b border-border-primary bg-background-secondary/50 px-[5%] py-3 md:py-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Upcoming
            </p>
            <h2 className="text-lg font-bold leading-tight tracking-tight text-text-primary md:text-xl">
              Events
            </h2>
          </div>
          <a
            href="/events"
            className="inline-flex shrink-0 items-center justify-center self-start rounded-full border border-border-primary bg-background-primary px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:bg-background-secondary sm:self-auto"
          >
            View all events
            <span className="ml-1" aria-hidden>
              →
            </span>
          </a>
        </div>

        {events.length > 0 ? (
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] md:mt-3 md:gap-3">
            {events.map((ev) => (
              <li key={ev.id} className="min-w-0">
                <a
                  href="/events"
                  className="block rounded-lg border border-border-primary bg-background-primary p-3 shadow-sm ring-1 ring-border-primary/25 transition hover:border-primary/35 hover:shadow"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <time
                      className="font-medium tabular-nums text-text-primary"
                      dateTime={ev.date}
                    >
                      {new Date(ev.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span className="shrink-0 tabular-nums">{ev.time}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-text-primary">
                    {ev.title}
                  </p>
                  {ev.description ? (
                    <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                      {ev.description}
                    </p>
                  ) : null}
                  {ev.location ? (
                    <p className="mt-2 text-[11px] font-medium leading-tight text-primary">
                      {ev.location}
                    </p>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-md border border-dashed border-border-primary bg-background-primary/50 px-3 py-3 text-center text-xs text-muted-foreground">
            No upcoming events right now.
          </p>
        )}
      </div>
    </section>
  );
}
