"use server";

import React from "react";
import Header69 from "../components/Header69.jsx";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchYoutube() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/media?type=YOUTUBE`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.media || data || [];
}

export default async function SocialPage() {
  const items = await fetchYoutube();

  return (
    <div>
      <Header69
        imageUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2100&h=900&q=80"
        title="Social Media"
        subtitle="Watch our latest YouTube highlights and media appearances."
      />
      <section className="px-[5%] py-12 md:py-16 lg:py-20 bg-background-secondary">
        <div className="container">
          <div className="mb-8 md:mb-12 flex flex-col gap-2">
            <p className="text-sm font-semibold text-muted-foreground">Social</p>
            <h1 className="text-3xl font-bold md:text-4xl">Media Highlights</h1>
            <p className="text-muted-foreground md:text-md">
              Curated clips, interviews, and explainers from CAP.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((m) => (
              <div
                key={m.id}
                className="overflow-hidden rounded-xl border border-border-primary bg-background-primary/95 shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-video">
                  <iframe
                    src={m.url}
                    title={m.url}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    YouTube
                  </p>
                  <p className="text-sm text-foreground line-clamp-2">
                    {m.url}
                  </p>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No social media videos yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

