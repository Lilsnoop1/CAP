"use server";

import Blog12 from "../components/Blog12.jsx";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchEmags(limit = 6) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/content?type=EMAGAZINE&limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.contents || [];
}

export default async function EmagSection() {
  const emagazines = await fetchEmags(6);
  return <Blog12 emagazines={emagazines} />;
}

