"use server";

import Blog14 from "../components/Blog14.jsx";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchOpeds(limit = 6) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/content?type=OPED&limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.contents || [];
}

export default async function OpedSection() {
  const opeds = await fetchOpeds(6);
  return <Blog14 articles={opeds} />;
}

