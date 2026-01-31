"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function CommentsSection({ contentId, initialComments = [] }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = async () => {
    if (!contentId) return;
    const res = await fetch(`/api/comments?contentId=${contentId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      setComments(data?.comments || data || []);
    }
  };

  const submit = async () => {
    if (!session?.user || !text.trim() || !contentId) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim(), contentId }),
    });
    if (!res.ok) {
      setError("Failed to add comment.");
      setLoading(false);
      return;
    }
    setText("");
    await refresh();
    setLoading(false);
  };

  const remove = async (id) => {
    if (!id) return;
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    await refresh();
  };

  return (
    <section className="px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold md:text-3xl">Comments</h3>
          <Button
            size="sm"
            variant="secondary"
            onClick={refresh}
            className="cursor-pointer"
          >
            Refresh
          </Button>
        </div>

        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-md border border-border-primary/70 bg-background-primary px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  {c.user?.name || c.user?.email || "User"}
                </p>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => remove(c.id)}
                >
                  Delete
                </Button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
        </div>

        <div className="rounded-md border border-border-primary bg-background-secondary p-4 space-y-3">
          {session?.user ? (
            <>
              <p className="text-sm font-semibold">Add a comment</p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
                rows={3}
                placeholder="Write your comment..."
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex justify-end">
                <Button size="sm" onClick={submit} disabled={loading}>
                  {loading ? "Posting..." : "Post comment"}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Sign in to add a comment.
              </p>
              <Button
                size="sm"
                variant="default"
                className="cursor-pointer"
                onClick={() => (window.location.href = "/api/auth/signin")}
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

