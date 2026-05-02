"use client";

import { useState } from "react";

export const ARTICLE_IMAGE_FALLBACK =
  "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg";

export const ARTICLE_AVATAR_FALLBACK =
  "https://cdn.prod.website-files.com/624380709031623bfe4aee60/6243807090316203124aee66_placeholder-image.svg";

export default function ArticleSafeImage({
  src,
  alt = "",
  className,
  fallback = ARTICLE_IMAGE_FALLBACK,
  loading = "lazy",
}) {
  const [broken, setBroken] = useState(false);
  const effective = !src?.trim?.() || broken ? fallback : src;

  return (
    <img
      src={effective}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setBroken(true)}
    />
  );
}
