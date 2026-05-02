"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MessageCircle, RefreshCw, Trash2 } from "lucide-react";

function commentInitials(name, email) {
  const n = (name || email || "?").trim();
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return n.slice(0, 2).toUpperCase() || "?";
}

function formatCommentDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

export default function CommentsSection({ contentId, initialComments = [] }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState({});
  const [error, setError] = useState(null);

  const sessionUser = session?.user;
  const canModerate =
    sessionUser?.role === "ADMIN" || sessionUser?.role === "EDITOR";

  const identityLine = useMemo(() => {
    if (!sessionUser) return null;
    const name = sessionUser.name?.trim() || "Member";
    const email = sessionUser.email?.trim() || "";
    return { name, email };
  }, [sessionUser]);

  const refresh = async () => {
    if (!contentId) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/comments?contentId=${contentId}`, {
        cache: "no-store",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data?.comments || data || []);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const submit = async () => {
    if (!sessionUser || !text.trim() || !contentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), contentId }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        setError(detail.error || "Failed to add comment.");
        return;
      }
      setText("");
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!id) return;
    setDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await refresh();
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const canDeleteComment = (comment) => {
    if (!sessionUser) return false;
    if (comment.user?.id && comment.user.id === sessionUser.id) return true;
    return canModerate;
  };

  return (
    <section className="bg-background-primary px-[5%] py-16 md:py-20 lg:py-24">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-background-secondary text-text-primary ring-1 ring-border-primary">
              <MessageCircle className="size-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Discussion
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {comments.length === 0
                  ? "No comments yet — start the conversation."
                  : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={refresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Updating…" : "Refresh"}
          </Button>
        </div>

        <div className="space-y-4">
          {comments.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-border-primary bg-background-secondary/60 p-5 shadow-sm ring-1 ring-border-primary/40 md:p-6"
            >
              <div className="flex gap-4">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background-primary text-sm font-semibold text-text-primary ring-2 ring-border-primary"
                  aria-hidden
                >
                  {commentInitials(c.user?.name, c.user?.email)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-text-primary">
                        {c.user?.name?.trim() || "Member"}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground break-all">
                        {c.user?.email || ""}
                      </p>
                      {c.createdAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatCommentDate(c.createdAt)}
                        </p>
                      )}
                    </div>
                    {canDeleteComment(c) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 shrink-0 px-2 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(c.id)}
                        disabled={!!deleting[c.id]}
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">Delete comment</span>
                      </Button>
                    )}
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-text-primary">
                    {c.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border-primary bg-background-secondary/80 p-6 shadow-sm ring-1 ring-border-primary/50 md:p-8">
          {status === "loading" ? (
            <p className="text-sm text-muted-foreground">Loading session…</p>
          ) : sessionUser && identityLine ? (
            <>
              <div className="mb-5 rounded-xl border border-border-primary/60 bg-background-primary px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Commenting as
                </p>
                <p className="mt-1 text-base font-semibold text-text-primary">
                  {identityLine.name}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground break-all">
                  {identityLine.email}
                </p>
              </div>
              <label className="sr-only" htmlFor="comment-text">
                Your comment
              </label>
              <textarea
                id="comment-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[140px] w-full resize-y rounded-xl border border-border-primary bg-background-primary px-4 py-3 text-[15px] text-text-primary outline-none ring-offset-background transition placeholder:text-muted-foreground focus:ring-2 focus:ring-[var(--border-contrast)]"
                rows={5}
                placeholder="Share your perspective…"
              />
              {error && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  onClick={submit}
                  disabled={loading || !text.trim()}
                  className="min-w-[140px]"
                >
                  {loading ? "Posting…" : "Post comment"}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Sign in with your account to comment. Your name and email will be
                shown with your comment.
              </p>
              <Button
                size="sm"
                className="shrink-0"
                onClick={() => {
                  window.location.href = "/auth/signin";
                }}
              >
                Sign in
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
