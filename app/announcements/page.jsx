"use server";

import React from "react";
import Header69 from "../components/Header69.jsx";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

async function fetchAnnouncements() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/content?type=ANNOUNCEMENT`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.contents || [];
}

export default async function AnnouncementsPage() {
  const announcements = await fetchAnnouncements();

  return (
    <div>
      <Header69
        imageUrl="https://images.unsplash.com/photo-1529333166433-94c3c4d7fac4?auto=format&fit=crop&w=2100&h=900&q=80"
        title="Announcements"
        subtitle="Official updates and notices from CAP."
      />
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-background-secondary/60">
        <div className="container space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="group relative overflow-hidden rounded-2xl border border-border-primary bg-background-primary shadow-md transition hover:shadow-xl"
              >
                <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase text-white shadow">
                  Announcement
                </div>
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={
                      a?.media?.[0]?.url ||
                      "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    }
                    alt={a.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-xl font-bold leading-tight">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {a.body || "View announcement"}
                  </p>
                  <div className="flex justify-end">
                    <span className="text-sm font-semibold text-primary">View details →</span>
                  </div>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-sm text-muted-foreground">No announcements available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

