"use client";

import React, { useState } from "react";
import BlogPostHeader from "./BlogPostHeader.jsx";
import Content30 from "./Content30.jsx";
import ArticleSafeImage from "./ArticleSafeImage.jsx";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const fetchOpts = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

export default function ArticlePageClient({
  article,
  isPrivileged,
  authorName: authorNameFallback,
  authorEmail: authorEmailFallback,
  heroImage,
  heroId,
  contentImage,
  contentMediaId,
  galleryMedia = [],
  tags,
}) {
  const [localArticle, setLocalArticle] = useState(article);
  const [localHero, setLocalHero] = useState(heroImage || "");
  const [localContentImage, setLocalContentImage] = useState(contentImage || "");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const displayAuthorName =
    localArticle?.author?.name?.trim?.() || authorNameFallback || "CAP Contributor";
  const displayAuthorEmail =
    localArticle?.author?.email?.trim?.() || authorEmailFallback || "";

  const authorId = localArticle?.author?.id;
  const canEditAuthor = Boolean(isPrivileged && authorId);

  const openModal = (field, label, type, value) => {
    setModal({ field, label, type, value: value ?? "" });
    setError(null);
  };

  const closeModal = () => setModal(null);

  const submitUpdate = async () => {
    if (!modal) return;
    setSaving(true);
    setError(null);
    try {
      if (modal.field === "authorName" || modal.field === "authorEmail") {
        const payload =
          modal.field === "authorName"
            ? { authorName: modal.value.trim() }
            : { authorEmail: modal.value.trim() };
        const res = await fetch(`/api/content/${localArticle.id}`, {
          method: "PUT",
          ...fetchOpts,
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const detail = await res.json().catch(() => ({}));
          throw new Error(detail.error || "Failed to update author");
        }
        const updated = await res.json();
        setLocalArticle(updated);
        closeModal();
        return;
      }

      if (modal.field === "title" || modal.field === "body") {
        const payload = { [modal.field]: modal.value };
        const res = await fetch(`/api/content/${localArticle.id}`, {
          method: "PUT",
          ...fetchOpts,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update content");
        const updated = await res.json();
        setLocalArticle(updated);
        closeModal();
        return;
      }

      if (modal.field === "heroImage") {
        if (heroId) {
          const res = await fetch(`/api/media/${heroId}`, {
            method: "PUT",
            ...fetchOpts,
            body: JSON.stringify({ url: modal.value }),
          });
          if (!res.ok) throw new Error("Failed to update hero image");
        } else {
          const res = await fetch("/api/media", {
            method: "POST",
            ...fetchOpts,
            body: JSON.stringify({
              type: "IMAGE",
              url: modal.value,
              contentId: localArticle.id,
            }),
          });
          if (!res.ok) throw new Error("Failed to create hero image");
        }
        setLocalHero(modal.value);
      }

      if (modal.field === "contentImage") {
        if (contentMediaId) {
          const res = await fetch(`/api/media/${contentMediaId}`, {
            method: "PUT",
            ...fetchOpts,
            body: JSON.stringify({ url: modal.value }),
          });
          if (!res.ok) throw new Error("Failed to update content image");
        } else {
          const res = await fetch("/api/media", {
            method: "POST",
            ...fetchOpts,
            body: JSON.stringify({
              type: "IMAGE",
              url: modal.value,
              contentId: localArticle.id,
            }),
          });
          if (!res.ok) throw new Error("Failed to create content image");
        }
        setLocalContentImage(modal.value);
      }

      closeModal();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const modalInputIsEmail = modal?.field === "authorEmail";

  return (
    <>
      <BlogPostHeader
        title={localArticle.title}
        authorName={displayAuthorName}
        publishedAt={localArticle.publishedAt}
        heroImage={localHero}
        canEdit={isPrivileged}
        onEditTitle={() =>
          openModal("title", "Edit title", "text", localArticle.title)
        }
        onEditHero={() =>
          openModal("heroImage", "Edit hero image URL", "text", localHero)
        }
      />
      <Content30
        body={localArticle.body}
        authorName={displayAuthorName}
        authorEmail={displayAuthorEmail}
        contentImage={localContentImage}
        tags={tags}
        canEdit={isPrivileged}
        onEditBody={() =>
          openModal("body", "Edit article body", "textarea", localArticle.body)
        }
        onEditContentImage={() =>
          openModal(
            "contentImage",
            "Edit inline image URL",
            "text",
            localContentImage
          )
        }
        onEditAuthorName={
          canEditAuthor
            ? () =>
                openModal(
                  "authorName",
                  "Author name",
                  "text",
                  displayAuthorName
                )
            : undefined
        }
        onEditAuthorEmail={
          canEditAuthor
            ? () =>
                openModal(
                  "authorEmail",
                  "Author email",
                  "text",
                  displayAuthorEmail
                )
            : undefined
        }
      />

      {localArticle?.type === "OPED" && galleryMedia?.length > 0 && (
        <section
          aria-label="Article image gallery"
          className="bg-background-secondary px-[5%] py-14 md:py-20"
        >
          <div className="container mx-auto max-w-5xl">
            <header className="mb-8 md:mb-10">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Gallery
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                More from this piece
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Additional images attached to this article ({galleryMedia.length}{" "}
                {galleryMedia.length === 1 ? "image" : "images"}).
              </p>
            </header>
            <div className="relative px-10 md:px-14">
              <Carousel
                opts={{
                  align: "center",
                  loop: galleryMedia.length > 1,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-3 md:-ml-4">
                  {galleryMedia.map((item, idx) => (
                    <CarouselItem
                      key={item.id || `${item.url}-${idx}`}
                      className="pl-3 md:basis-full md:pl-4"
                    >
                      <figure className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary shadow-md ring-1 ring-border-primary/30">
                        <ArticleSafeImage
                          src={item.url}
                          alt=""
                          className="aspect-[16/10] w-full max-h-[min(70vh,560px)] object-cover"
                        />
                      </figure>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {galleryMedia.length > 1 && (
                  <>
                    <CarouselPrevious
                      type="button"
                      className="left-0 top-[42%] z-10 border-border-primary bg-background-primary text-text-primary shadow-md hover:bg-background-secondary md:left-1"
                    />
                    <CarouselNext
                      type="button"
                      className="right-0 top-[42%] z-10 border-border-primary bg-background-primary text-text-primary shadow-md hover:bg-background-secondary md:right-1"
                    />
                  </>
                )}
              </Carousel>
            </div>
          </div>
        </section>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-border-primary bg-[var(--background-primary)] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-text-primary">
                {modal.label}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="shrink-0 rounded-full border border-border-primary bg-background-secondary px-3 py-1 text-xs font-semibold text-muted-foreground hover:bg-background-primary"
              >
                Close
              </button>
            </div>
            {modal.type === "textarea" ? (
              <textarea
                value={modal.value}
                onChange={(e) =>
                  setModal((prev) => ({ ...prev, value: e.target.value }))
                }
                className="min-h-[180px] w-full rounded-lg border border-border-primary bg-background-primary px-4 py-3 text-sm text-text-primary outline-none ring-offset-background focus:ring-2 focus:ring-primary"
              />
            ) : (
              <input
                type={modalInputIsEmail ? "email" : "text"}
                value={modal.value}
                onChange={(e) =>
                  setModal((prev) => ({ ...prev, value: e.target.value }))
                }
                className="w-full rounded-lg border border-border-primary bg-background-primary px-4 py-3 text-sm text-text-primary outline-none ring-offset-background focus:ring-2 focus:ring-primary"
              />
            )}
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={closeModal} className="px-4">
                Cancel
              </Button>
              <Button
                onClick={submitUpdate}
                disabled={saving}
                className="bg-[var(--text-primary)] px-5 text-[var(--background-primary)] hover:opacity-90"
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
