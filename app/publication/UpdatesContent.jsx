"use server";

import Link from "next/link";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

async function fetchAnnouncements(limit = 3) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/content?type=ANNOUNCEMENT&limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.contents || [];
}

async function fetchOpeds(limit = 3) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/content?type=OPED&limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.contents || [];
}

export default async function UpdatesContent() {
  const [announcements, opeds] = await Promise.all([fetchAnnouncements(3), fetchOpeds(3)]);

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-background-secondary/60">
      <div className="container space-y-12">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Updates</p>
              <h2 className="text-3xl font-bold md:text-4xl">Announcements</h2>
            </div>
            <Link
              href="/announcements"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all announcements →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => (
              <Link
                key={a.id}
                href={`/announcements?slug=${encodeURIComponent(a.slug)}`}
                className="group relative overflow-hidden rounded-xl border border-border-primary bg-background-primary shadow-sm transition hover:shadow-lg"
              >
                <div className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase text-white shadow">
                  Announcement
                </div>
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={
                      a?.media?.[0]?.url ||
                      "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    }
                    alt={a.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="text-lg font-bold line-clamp-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {a.body || "View announcement"}
                  </p>
                </div>
              </Link>
            ))}
            {announcements.length === 0 && (
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Articles</p>
              <h2 className="text-3xl font-bold md:text-4xl">Trending Articles</h2>
            </div>
            <Link
              href="/trending-articles"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opeds.map((item) => (
              <Link
                href={`/article?slug=${encodeURIComponent(item.slug)}`}
                key={item.id}
                className="flex h-full flex-col justify-between rounded-lg border border-border-primary bg-background-primary overflow-hidden transition hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={
                      item?.media?.[0]?.url ||
                      "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    }
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {item.type}
                  </p>
                  <h3 className="text-lg font-bold md:text-xl line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.body || "Read more"}
                  </p>
                </div>
                <span className="px-4 pb-4 text-sm font-semibold text-primary">
                  Read article →
                </span>
              </Link>
            ))}
            {opeds.length === 0 && (
              <p className="text-sm text-muted-foreground">No articles found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

