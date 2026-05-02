"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { RxPencil1 } from "react-icons/rx";
import {
  BiLinkAlt,
  BiLogoFacebookCircle,
  BiLogoLinkedinSquare,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import ArticleSafeImage, {
  ARTICLE_IMAGE_FALLBACK,
} from "./ArticleSafeImage.jsx";

export default function BlogPostHeader({
  title = "Article",
  authorName = "CAP Contributor",
  publishedAt,
  heroImage,
  canEdit = false,
  onEditTitle,
  onEditHero,
}) {
  const dateLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <section id="article-hero" className="bg-background-primary px-[5%] pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-20 lg:pt-20">
      <div className="container mx-auto">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-x-20">
          <div className="flex max-w-xl flex-col lg:max-w-none">
            <Breadcrumb className="mb-8 flex w-full items-center md:mb-10">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/publication">Publication</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/trending-articles">Articles</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-8 flex flex-wrap items-start gap-x-3 gap-y-2 md:mb-10">
              <h1 className="min-w-0 flex-1 text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
                {title}
              </h1>
              {canEdit && onEditTitle && (
                <button
                  type="button"
                  onClick={onEditTitle}
                  className="mt-1 shrink-0 rounded-full border border-border-primary bg-background-secondary p-2 text-muted-foreground transition hover:bg-background-primary hover:text-text-primary"
                  title="Edit title"
                >
                  <RxPencil1 className="size-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <p className="text-base font-semibold text-text-primary md:text-lg">
                  <span className="font-normal text-muted-foreground">By </span>
                  {authorName}
                </p>
                {dateLabel && (
                  <p className="mt-2 text-sm text-muted-foreground">{dateLabel}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Share
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="#"
                    className="rounded-[1.25rem] bg-background-secondary p-1.5 transition hover:opacity-90"
                    aria-label="Copy link"
                  >
                    <BiLinkAlt className="size-6" />
                  </a>
                  <a
                    href="#"
                    className="rounded-[1.25rem] bg-background-secondary p-1.5 transition hover:opacity-90"
                    aria-label="Share on LinkedIn"
                  >
                    <BiLogoLinkedinSquare className="size-6" />
                  </a>
                  <a
                    href="#"
                    className="rounded-[1.25rem] bg-background-secondary p-1.5 transition hover:opacity-90"
                    aria-label="Share on X"
                  >
                    <FaXTwitter className="size-6 p-0.5" />
                  </a>
                  <a
                    href="#"
                    className="rounded-[1.25rem] bg-background-secondary p-1.5 transition hover:opacity-90"
                    aria-label="Share on Facebook"
                  >
                    <BiLogoFacebookCircle className="size-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-border-primary bg-background-secondary shadow-sm ring-1 ring-border-primary/50">
            <ArticleSafeImage
              src={heroImage}
              alt=""
              fallback={ARTICLE_IMAGE_FALLBACK}
              className="aspect-[3/2] w-full object-cover"
              loading="eager"
            />
            {canEdit && onEditHero && (
              <button
                type="button"
                onClick={onEditHero}
                className="absolute right-3 top-3 rounded-full border border-border-primary bg-background-primary p-2 text-muted-foreground shadow-sm transition hover:bg-background-secondary"
                title="Edit hero image URL"
              >
                <RxPencil1 className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
