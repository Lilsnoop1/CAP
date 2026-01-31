"use server";

import Gallery25 from "../components/Gallery25.jsx";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchGalleryMedia() {
  const base = getBaseUrl();
  const [youtubeRes, imageRes] = await Promise.all([
    fetch(`${base}/api/media?type=YOUTUBE`, { cache: "no-store" }),
    fetch(`${base}/api/media?type=IMAGE`, { cache: "no-store" }),
  ]);
  const youtube = youtubeRes.ok ? (await youtubeRes.json())?.media || [] : [];
  const images = imageRes.ok ? (await imageRes.json())?.media || [] : [];
  return [...youtube, ...images];
}

export default async function GallerySection() {
  const media = await fetchGalleryMedia();
  return <Gallery25 media={media} />;
}

