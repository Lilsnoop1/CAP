"use client";

import React from "react";
import { RxPencil1 } from "react-icons/rx";
import ArticleSafeImage, {
  ARTICLE_AVATAR_FALLBACK,
  ARTICLE_IMAGE_FALLBACK,
} from "./ArticleSafeImage.jsx";

export default function Content30({
  body,
  authorName = "CAP Contributor",
  authorEmail = "",
  contentImage,
  tags = [],
  canEdit = false,
  onEditBody,
  onEditContentImage,
  onEditAuthorName,
  onEditAuthorEmail,
}) {
  const paragraphs =
    body && typeof body === "string"
      ? body.split(/\n{2,}/).filter(Boolean)
      : [];

  const tagList =
    tags?.length > 0
      ? tags
      : [];

  return (
    <section
      id="article-body"
      className="bg-background-primary px-[5%] py-14 md:py-20 lg:py-24"
    >
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl">
          <div className="relative mb-10 md:mb-14">
            {canEdit && onEditBody && (
              <button
                type="button"
                onClick={onEditBody}
                className="absolute -top-1 right-0 rounded-full border border-border-primary bg-background-primary p-2 text-muted-foreground shadow-sm transition hover:bg-background-secondary hover:text-text-primary"
                title="Edit article body"
              >
                <RxPencil1 className="size-4" />
              </button>
            )}
            <div className="prose prose-neutral max-w-none prose-p:leading-relaxed prose-p:my-5 first:prose-p:mt-0 md:prose-lg [&_p]:text-[var(--text-primary)]">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <p className="text-muted-foreground italic">
                  {canEdit
                    ? "No article body yet. Use the edit control to add content."
                    : "No content available."}
                </p>
              )}
            </div>
          </div>

          <figure className="relative my-12 md:my-16">
            <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-secondary ring-1 ring-border-primary/60">
              <ArticleSafeImage
                src={contentImage}
                alt=""
                fallback={ARTICLE_IMAGE_FALLBACK}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            {canEdit && onEditContentImage && (
              <button
                type="button"
                onClick={onEditContentImage}
                className="absolute right-3 top-3 rounded-full border border-border-primary bg-background-primary p-2 text-muted-foreground shadow-sm transition hover:bg-background-secondary"
                title="Edit inline image URL"
              >
                <RxPencil1 className="size-4" />
              </button>
            )}
          </figure>

          {tagList.length > 0 && (
            <div className="mb-14 md:mb-16">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tags
              </p>
              <ul className="flex flex-wrap gap-2">
                {tagList.map((tag) => (
                  <li key={tag}>
                    <span className="inline-block rounded-full border border-border-primary bg-background-secondary px-3 py-1 text-sm font-medium text-text-primary">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mx-auto mt-14 max-w-xl text-center md:mt-20">
            <div className="rounded-2xl border border-border-primary bg-background-secondary/80 px-6 py-8 md:px-10 md:py-10">
              <div className="mx-auto mb-6 flex justify-center">
                <div className="size-16 overflow-hidden rounded-full border-2 border-border-primary bg-background-primary ring-2 ring-background-primary">
                  <ArticleSafeImage
                    src={null}
                    alt=""
                    fallback={ARTICLE_AVATAR_FALLBACK}
                    className="size-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <p className="text-lg font-semibold tracking-tight text-text-primary md:text-xl">
                    {authorName}
                  </p>
                  {canEdit && onEditAuthorName && (
                    <button
                      type="button"
                      onClick={onEditAuthorName}
                      className="shrink-0 rounded-full border border-border-primary bg-background-primary p-1.5 text-muted-foreground transition hover:bg-background-primary hover:text-text-primary"
                      title="Edit author name"
                    >
                      <RxPencil1 className="size-3.5" />
                    </button>
                  )}
                </div>

                {authorEmail ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <p className="max-w-full break-all text-sm text-muted-foreground md:text-base">
                      {authorEmail}
                    </p>
                    {canEdit && onEditAuthorEmail && (
                      <button
                        type="button"
                        onClick={onEditAuthorEmail}
                        className="shrink-0 rounded-full border border-border-primary bg-background-primary p-1.5 text-muted-foreground transition hover:text-text-primary"
                        title="Edit author email"
                      >
                        <RxPencil1 className="size-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  canEdit &&
                  onEditAuthorEmail && (
                    <button
                      type="button"
                      onClick={onEditAuthorEmail}
                      className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Add author email
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
