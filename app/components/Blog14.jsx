"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RxChevronRight } from "react-icons/rx";

export default function Blog14({ articles = [] }) {
  const items = articles.slice(0, 3);
  const hasMoreArticles = articles.length > 3;

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28 bg-background-primary">
      <div className="container max-w-7xl">
        <div className="mb-12 md:mb-16 lg:mb-20">
          <div className="mx-auto w-full max-w-2xl text-center">
            <p className="mb-3 font-semibold text-primary md:mb-4">Insights</p>
            <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-6xl lg:text-7xl">
              Latest from our writers
            </h1>
            <p className="text-lg text-muted-foreground">Perspectives on the issues reshaping our world</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <article
              key={article.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <Link
                href={`/article?slug=${encodeURIComponent(article.slug)}`}
                className="block"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={
                      article.media?.[0]?.url ||
                      "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    }
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                    {article.type || "OPED"}
                  </span>
                </div>

                <Link
                  href={`/article?slug=${encodeURIComponent(article.slug)}`}
                  className="block group"
                >
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-3 leading-tight">
                    {article.title}
                  </h2>
                </Link>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {article.body || "Read this insightful article exploring current perspectives and thought-provoking ideas."}
                </p>

                <Link
                  href={`/article?slug=${encodeURIComponent(article.slug)}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
                >
                  Read article
                  <RxChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {hasMoreArticles && (
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              <Link href="/trending-articles">
                See More Articles
                <RxChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

