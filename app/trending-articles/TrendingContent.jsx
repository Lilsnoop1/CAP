"use server";

import Link from "next/link";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchOpeds() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/content?type=OPED`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.contents || [];
}

export default async function TrendingContent() {
  const opeds = await fetchOpeds();
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-10 flex flex-col gap-3 md:mb-14">
          <h2 className="text-4xl font-bold md:text-5xl">Oped articles</h2>
          <p className="text-muted-foreground">
            Latest opinion pieces from CAP contributors.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
            <p className="text-sm text-muted-foreground">
              No OPED articles found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

