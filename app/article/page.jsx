"use server";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Cta27 from "../components/Cta27.jsx";
import Cta32 from "../components/Cta32.jsx";
import CommentsSection from "../components/CommentsSection.jsx";
import ArticlePageClient from "../components/ArticlePageClient.jsx";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchArticle(slug) {
  if (!slug) return null;
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/content/slug/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ searchParams }) {
  const { slug } = await searchParams;
  const article = await fetchArticle(slug);
  const session = await getServerSession(authOptions);
  const isPrivileged =
    session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";

  if (!slug) {
    return (
      <div className="px-[5%] py-16">
        <p className="text-lg font-semibold">Missing article slug.</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="px-[5%] py-16">
        <p className="text-lg font-semibold">Article not found.</p>
      </div>
    );
  }

  const heroImage = article?.media?.[0]?.url;
  const contentImage = article?.media?.[1]?.url;
  const authorName = article?.author?.name || "CAP Contributor";
  const authorTitle = article?.author?.email
    ? article.author.email
    : "Researcher, CAP";
  const tags = [article?.type, article?.slug].filter(Boolean);

  return (
    <div>
      <ArticlePageClient
        article={article}
        isPrivileged={isPrivileged}
        authorName={authorName}
        authorTitle={authorTitle}
        heroImage={heroImage}
        heroId={article?.media?.[0]?.id}
        contentImage={contentImage}
        contentMediaId={article?.media?.[1]?.id}
        tags={tags}
      />
      <CommentsSection
        contentId={article.id}
        initialComments={article.comments || []}
      />
      <Cta27 />
      <Cta32 />
    </div>
  );
}
