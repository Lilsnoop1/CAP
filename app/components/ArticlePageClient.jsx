"use client";

import React, { useState } from "react";
import BlogPostHeader3 from "./BlogPostHeader.jsx";
import Content30 from "./Content30.jsx";
import { Button } from "@/components/ui/button";

export default function ArticlePageClient({
  article,
  isPrivileged,
  authorName,
  authorTitle,
  heroImage,
  heroId,
  contentImage,
  contentMediaId,
  tags,
}) {
  const [localArticle, setLocalArticle] = useState(article);
  const [localHero, setLocalHero] = useState(heroImage || "");
  const [localContentImage, setLocalContentImage] = useState(contentImage || "");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const openModal = (field, label, type, value) => {
    setModal({ field, label, type, value: value || "" });
    setError(null);
  };

  const closeModal = () => setModal(null);

  const submitUpdate = async () => {
    if (!modal) return;
    setSaving(true);
    setError(null);
    try {
      if (modal.field === "title" || modal.field === "body") {
        const payload = { [modal.field]: modal.value };
        const res = await fetch(`/api/content/${localArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update content");
        setLocalArticle((prev) => ({ ...prev, ...payload }));
      }

      if (modal.field === "heroImage") {
        if (heroId) {
          const res = await fetch(`/api/media/${heroId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: modal.value }),
          });
          if (!res.ok) throw new Error("Failed to update hero image");
        } else {
          const res = await fetch("/api/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: modal.value }),
          });
          if (!res.ok) throw new Error("Failed to update content image");
        } else {
          const res = await fetch("/api/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

  return (
    <>
      <BlogPostHeader3
        title={localArticle.title}
        authorName={authorName}
        publishedAt={localArticle.publishedAt}
        heroImage={localHero}
        canEdit={isPrivileged}
        onEditTitle={() => openModal("title", "Edit title", "text", localArticle.title)}
        onEditHero={() => openModal("heroImage", "Edit hero image URL", "text", localHero)}
      />
      <Content30
        body={localArticle.body}
        authorName={authorName}
        authorTitle={authorTitle}
        contentImage={localContentImage}
        authorAvatar={localArticle?.author?.avatarUrl}
        tags={tags}
        canEdit={isPrivileged}
        onEditBody={() => openModal("body", "Edit content", "textarea", localArticle.body)}
        onEditContentImage={() =>
          openModal("contentImage", "Edit content image URL", "text", localContentImage)
        }
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{modal.label}</h3>
              <button
                onClick={closeModal}
                className="rounded-full border border-border-primary bg-white px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
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
                className="w-full min-h-[160px] rounded-lg border border-border-primary bg-white px-4 py-3 text-sm text-gray-900"
              />
            ) : (
              <input
                value={modal.value}
                onChange={(e) =>
                  setModal((prev) => ({ ...prev, value: e.target.value }))
                }
                className="w-full rounded-lg border border-border-primary bg-white px-4 py-3 text-sm text-gray-900"
              />
            )}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={closeModal} className="px-4">
                Cancel
              </Button>
              <Button
                onClick={submitUpdate}
                disabled={saving}
                className="px-5 bg-black text-white hover:bg-black/90"
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

