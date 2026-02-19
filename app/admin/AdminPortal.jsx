"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RxChevronRight } from "react-icons/rx";

const CONTENT_TYPES = ["OPED", "ANNOUNCEMENT", "GALLERY", "EMAGAZINE"];
const CONTENT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const MEDIA_TYPES = ["IMAGE", "VIDEO", "PDF"];

const inferMediaType = (mime = "") => {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime === "application/pdf") return "PDF";
  return "IMAGE";
};

function InlineField({ label, value, onChange, multiline }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md bg-background-secondary px-3 py-2 text-sm outline-none ring-1 ring-border-primary focus:ring-2 focus:ring-primary min-h-[120px]"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md bg-background-secondary px-3 py-2 text-sm outline-none ring-1 ring-border-primary focus:ring-2 focus:ring-primary"
        />
      )}
    </div>
  );
}

export default function AdminPortal({ userRole }) {
  const [activeTab, setActiveTab] = useState("content");

  const [search, setSearch] = useState("");
  const [contentFilter, setContentFilter] = useState("ALL");

  const [contents, setContents] = useState([]);
  const [media, setMedia] = useState([]);
  const [events, setEvents] = useState([]);
  const [editors, setEditors] = useState([]);
  const [contentMedia, setContentMedia] = useState([]);
  const [contentComments, setContentComments] = useState([]);
  const [newEditorEmail, setNewEditorEmail] = useState("");
  const [youtubeMedia, setYoutubeMedia] = useState([]);
  const [newYoutubeUrl, setNewYoutubeUrl] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    bio: "",
    profileImageUrl: "",
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventDraft, setEventDraft] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentDraft, setContentDraft] = useState(null);

  const [newContent, setNewContent] = useState({
    type: "OPED",
    title: "",
    slug: "",
    body: "",
  });
  const [newContentMediaQueue, setNewContentMediaQueue] = useState([]);
  const [newContentMediaUrlInput, setNewContentMediaUrlInput] = useState("");
  const [newContentMediaTypeInput, setNewContentMediaTypeInput] =
    useState("IMAGE");
  const [newContentMediaMimeInput, setNewContentMediaMimeInput] = useState("");

  const [newMedia, setNewMedia] = useState({
    type: "IMAGE",
    url: "",
    mimeType: "",
  });
  const [newMediaFile, setNewMediaFile] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadingContentMedia, setUploadingContentMedia] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");

  const visibleTabs =
    userRole === "ADMIN"
      ? ["content", "editors", "events", "members", "youtube", "subscriptions"]
      : ["content", "events", "members", "youtube"];

  useEffect(() => {
    if (activeTab === "content") {
      fetchContent();
    } else if (activeTab === "media") {
      fetchMedia();
    } else if (activeTab === "events") {
      fetchEvents();
    } else if (activeTab === "editors") {
      fetchEditors();
    } else if (activeTab === "members") {
      fetchMembers();
    } else if (activeTab === "youtube") {
      fetchYoutubeMedia();
    } else if (activeTab === "subscriptions") {
      fetchSubscriptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL("/api/content", window.location.origin);
      if (contentFilter !== "ALL") url.searchParams.set("type", contentFilter);
      if (search) url.searchParams.set("q", search);
      const res = await fetch(url.toString());
      if (!res.ok) {
        setContents([]);
        setError("Failed to fetch content");
        return;
      }
      const data = await res.json();
      setContents(data?.contents || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  const fetchContentMedia = async (contentId) => {
    if (!contentId) return;
    const res = await fetch(`/api/media?contentId=${contentId}`);
    if (!res.ok) {
      setContentMedia([]);
      return;
    }
    const data = await res.json();
    setContentMedia(data?.media || data || []);
  };

  const fetchContentComments = async (contentId) => {
    if (!contentId) return;
    const res = await fetch(`/api/comments?contentId=${contentId}`);
    if (!res.ok) {
      setContentComments([]);
      return;
    }
    const data = await res.json();
    setContentComments(data?.comments || data || []);
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members", { cache: "no-store" });
      const data = await res.json();
      setMembers(data?.members || data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchYoutubeMedia = async () => {
    try {
      const res = await fetch("/api/media?type=YOUTUBE", {
        cache: "no-store",
      });
      const data = await res.json();
      setYoutubeMedia(data?.media || data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubscription = async (email) => {
    if (!email) return;
    await fetch("/api/subscriptions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    await fetchSubscriptions();
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscriptions", {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) {
        setSubscriptions([]);
        return;
      }
      const data = await res.json();
      setSubscriptions(data?.subscriptions || data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMedia = async () => {
    setLoading(true);
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(data?.media || data || []);
    setLoading(false);
  };

  const fetchEvents = async () => {
    setLoading(true);
    const res = await fetch("/api/events", { credentials: "include" });
    const data = await res.json();
    setEvents(data?.events || data || []);
    setLoading(false);
  };

  const fetchEditors = async () => {
    setLoading(true);
    const res = await fetch("/api/users?role=EDITOR");
    const data = await res.json();
    setEditors(data?.users || data || []);
    setLoading(false);
  };

  const groupedContent = useMemo(() => {
    return CONTENT_TYPES.reduce((acc, type) => {
      acc[type] = contents.filter((c) => c.type === type);
      return acc;
    }, {});
  }, [contents]);

  const openContent = (c) => {
    setSelectedContent(c);
    setContentDraft({
      title: c.title || "",
      body: c.body || "",
      slug: c.slug || "",
      status: c.status || "DRAFT",
      type: c.type || "OPED",
    });
    fetchContentMedia(c.id);
    fetchContentComments(c.id);
  };

  const submitContentUpdate = async () => {
    if (!selectedContent) return;
    try {
      setError(null);
      const res = await fetch(`/api/content/${selectedContent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentDraft),
      });
      if (!res.ok) {
        setError("Failed to update content");
        return;
      }
      await fetchContent();
    } catch (err) {
      console.error(err);
      setError("Failed to update content");
    }
  };

  const deleteContent = async (id) => {
    try {
      setError(null);
      const res = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete content");
        return;
      }
      if (selectedContent?.id === id) {
        setSelectedContent(null);
        setContentDraft(null);
        setContentMedia([]);
        setContentComments([]);
      }
      await fetchContent();
    } catch (err) {
      console.error(err);
      setError("Failed to delete content");
    }
  };

  const createContent = async () => {
    if (!newContent.title || !newContent.slug) return;
    if (newContent.type === "EMAGAZINE" && newContentMediaQueue.length === 0) {
      setError("Emagazines require at least one PDF upload.");
      return;
    }
    try {
      setUploadingContentMedia(true);
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newContent,
          body: newContent.type === "EMAGAZINE" ? "" : newContent.body,
        }),
      });
      if (!res.ok) {
        setError("Failed to create content");
        return;
      }
      const created = await res.json();
      const contentId = created?.id;

      // Optional media attach (supports multiple)
      if (contentId && newContentMediaQueue.length) {
        if (
          newContent.type === "EMAGAZINE" &&
          newContentMediaQueue.some(
            (item) =>
              item.type !== "PDF" &&
              item.mimeType !== "application/pdf"
          )
        ) {
          throw new Error("Emagazines require PDF media.");
        }

        for (const item of newContentMediaQueue) {
          let url = item.url;
          let mimeType = item.mimeType;
          let derivedType = item.type || "IMAGE";

          if (item.file) {
            const formData = new FormData();
            formData.append("file", item.file);
            formData.append("prefix", `media/${contentId}`);
            const uploadRes = await fetch("/api/r2/upload", {
              method: "POST",
              body: formData,
            });
            if (!uploadRes.ok) {
              const detail = await uploadRes.json().catch(() => ({}));
              throw new Error(detail.error || "Upload failed");
            }
            const data = await uploadRes.json();
            url = data.url;
            mimeType = item.file.type || mimeType;
            derivedType = inferMediaType(item.file.type);
          }

          if (url) {
            await fetch("/api/media", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: derivedType,
                url,
                mimeType,
                contentId,
              }),
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create content");
    } finally {
      setNewContent({ type: "OPED", title: "", slug: "", body: "" });
      setNewContentMediaQueue([]);
      setUploadingContentMedia(false);
      await fetchContent();
    }
  };

  const createMedia = async () => {
    try {
      setUploadingMedia(true);
      let url = newMedia.url;
      let derivedType = newMedia.type;
      let mimeType = newMedia.mimeType;

      if (newMediaFile) {
        const formData = new FormData();
        formData.append("file", newMediaFile);
        formData.append(
          "prefix",
          selectedContent?.id ? `media/${selectedContent.id}` : "media"
        );
        const res = await fetch("/api/r2/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const detail = await res.json().catch(() => ({}));
          throw new Error(detail.error || "Upload failed");
        }
        const data = await res.json();
        url = data.url;
        mimeType = newMediaFile.type || mimeType;
        derivedType = inferMediaType(newMediaFile.type);
      }

      if (!url) throw new Error("URL missing");

      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMedia,
          url,
          type: derivedType,
          mimeType,
          contentId: selectedContent?.id || null,
        }),
      });
      setNewMedia({ type: "IMAGE", url: "", mimeType: "" });
      setNewMediaFile(null);
      if (selectedContent?.id) {
        await fetchContentMedia(selectedContent.id);
      } else {
        await fetchMedia();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingMedia(false);
    }
  };

  const deleteMedia = async (id) => {
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (selectedContent?.id) {
      await fetchContentMedia(selectedContent.id);
    } else {
      await fetchMedia();
    }
  };

  const createEditor = async () => {
    const email = newEditorEmail.trim().toLowerCase();
    if (!email) return;
    try {
      setError(null);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "EDITOR" }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        setError(detail.error || "Failed to create editor");
        return;
      }
      setError(null);
      setNewEditorEmail("");
      await fetchEditors();
    } catch (err) {
      console.error(err);
      setError("Failed to create editor");
    }
  };

  const addQueuedMediaUrl = () => {
    if (!newContentMediaUrlInput.trim()) return;
    if (newContent.type === "EMAGAZINE") {
      setError("Emagazines require PDF uploads, not URLs.");
      return;
    }
    setNewContentMediaQueue((q) => [
      ...q,
      {
        kind: "url",
        url: newContentMediaUrlInput.trim(),
        type: newContentMediaTypeInput,
        mimeType: newContentMediaMimeInput,
      },
    ]);
    setNewContentMediaUrlInput("");
    setNewContentMediaMimeInput("");
    setNewContentMediaTypeInput("IMAGE");
  };

  const addQueuedMediaFiles = (files) => {
    if (!files?.length) return;
    const items = Array.from(files).map((file) => {
      const inferred = inferMediaType(file.type);
      return {
        kind: "file",
        file,
        type: newContent.type === "EMAGAZINE" ? "PDF" : inferred,
        mimeType: file.type,
        name: file.name,
      };
    });
    if (
      newContent.type === "EMAGAZINE" &&
      items.some((i) => i.mimeType !== "application/pdf")
    ) {
      setError("Emagazines only accept PDF files.");
      return;
    }
    setNewContentMediaQueue((q) => [...q, ...items]);
  };

  const removeQueuedMedia = (index) => {
    setNewContentMediaQueue((q) => q.filter((_, i) => i !== index));
  };

  const deleteComment = async (commentId) => {
    if (!commentId) return;
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });
    if (res.ok && selectedContent?.id) {
      await fetchContentComments(selectedContent.id);
    }
  };

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    // basic client-side checks
    const parsedDate = new Date(newEvent.date);
    if (Number.isNaN(parsedDate.getTime())) {
      setError("Invalid date format");
      return;
    }
    const today = new Date();
    const dateOnly = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    if (dateOnly < todayOnly) {
      setError("Date must be today or in the future");
      return;
    }
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
        credentials: "include",
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        setError(detail.error || "Failed to create event");
        return;
      }
      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
      });
      await fetchEvents();
    } catch (err) {
      console.error(err);
      setError("Failed to create event");
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchEvents();
    } catch (err) {
      console.error(err);
      setError("Failed to delete event");
    }
  };

  const startEditEvent = (ev) => {
    setEditingEvent(ev);
    setEventDraft({
      title: ev.title || "",
      description: ev.description || "",
      date: ev.date ? ev.date.slice(0, 10) : "",
      time: ev.time || "",
      location: ev.location || "",
    });
  };

  const cancelEditEvent = () => {
    setEditingEvent(null);
    setEventDraft({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
    });
  };

  const saveEditEvent = async () => {
    if (!editingEvent) return;
    const payload = { ...eventDraft };
    try {
      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditingEvent(null);
      await fetchEvents();
    } catch (err) {
      console.error(err);
      setError("Failed to update event");
    }
  };

  const createYoutube = async () => {
    if (!newYoutubeUrl.trim()) return;
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "YOUTUBE", url: newYoutubeUrl.trim() }),
        credentials: "include",
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        setError(detail.error || "Failed to add YouTube link");
        return;
      }
      setNewYoutubeUrl("");
      await fetchYoutubeMedia();
    } catch (err) {
      console.error(err);
      setError("Failed to add YouTube link");
    }
  };

  const deleteYoutube = async (id) => {
    await fetch(`/api/media/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await fetchYoutubeMedia();
  };

  const createMember = async () => {
    if (!newMember.name || !newMember.role) return;
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
        credentials: "include",
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        setError(detail.error || "Failed to create member");
        return;
      }
      setNewMember({ name: "", role: "", bio: "", profileImageUrl: "" });
      await fetchMembers();
    } catch (err) {
      console.error(err);
      setError("Failed to create member");
    }
  };

  const updateMember = async (id, partial) => {
    await fetch(`/api/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
      credentials: "include",
    });
    await fetchMembers();
  };

  const deleteMember = async (id) => {
    await fetch(`/api/members/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await fetchMembers();
  };

  return (
    <div className="px-[5%] py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Admin Portal
          </p>
          <h1 className="text-3xl font-bold">Manage CAP content</h1>
        </div>
        <div className="rounded-full bg-background-secondary px-4 py-2 text-sm font-semibold">
          Role: {userRole}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="no-scrollbar mb-4 flex w-full overflow-x-auto bg-background-secondary">
          {visibleTabs.includes("content") && (
            <TabsTrigger value="content">Content</TabsTrigger>
          )}
          {visibleTabs.includes("events") && (
            <TabsTrigger value="events">Events</TabsTrigger>
          )}
        {visibleTabs.includes("members") && (
          <TabsTrigger value="members">Members</TabsTrigger>
        )}
        {visibleTabs.includes("youtube") && (
          <TabsTrigger value="youtube">YouTube Media</TabsTrigger>
        )}
          {visibleTabs.includes("editors") && (
            <TabsTrigger value="editors">Editors</TabsTrigger>
          )}
          {visibleTabs.includes("subscriptions") && (
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchContent()}
              placeholder="Search content..."
              className="w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
            />
            <select
              value={contentFilter}
              onChange={(e) => setContentFilter(e.target.value)}
              className="rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
            >
              <option value="ALL">All types</option>
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              variant="secondary"
              onClick={fetchContent}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {CONTENT_TYPES.map((type) => (
              <div
                key={type}
                className="rounded-xl bg-background-secondary/60 p-4 shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {type}
                  </p>
                  <h3 className="text-lg font-semibold">
                    {groupedContent[type]?.length || 0} item(s)
                  </h3>
                </div>
                <div className="mt-3 divide-y divide-border-primary/30 border-t border-border-primary/40">
                  {(groupedContent[type] || []).map((c) => (
                    <div
                      key={c.id}
                      className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{c.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.status} · {c.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          className="text-xs font-semibold text-primary hover:underline"
                          href={`/article?slug=${encodeURIComponent(c.slug)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open
                        </a>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => openContent(c)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => deleteContent(c.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(groupedContent[type] || []).length === 0 && (
                    <p className="py-3 text-sm text-muted-foreground">No content yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-background-primary p-5 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Quick add content</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Choose a type, add details, then attach media (PDF required for EMAGAZINE).
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Type
                </p>
                <select
                  value={newContent.type}
                  onChange={(e) =>
                    setNewContent((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full rounded-md border border-border-primary bg-background-secondary px-3 py-2 text-sm"
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <InlineField
                label="Title"
                value={newContent.title}
                onChange={(v) =>
                  setNewContent((prev) => ({ ...prev, title: v }))
                }
              />
              <InlineField
                label="Slug"
                value={newContent.slug}
                onChange={(v) =>
                  setNewContent((prev) => ({ ...prev, slug: v }))
                }
              />
              {newContent.type !== "EMAGAZINE" && (
                <InlineField
                  label="Body"
                  value={newContent.body}
                  onChange={(v) =>
                    setNewContent((prev) => ({ ...prev, body: v }))
                  }
                  multiline
                />
              )}
            </div>
            <div className="mt-4 rounded-md border border-border-primary/60 bg-background-secondary p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">
                  {newContent.type === "EMAGAZINE"
                    ? "Attach PDF (required)"
                    : "Attach media (optional)"}
                </p>
                <span className="text-xs text-muted-foreground">
                  {newContent.type === "EMAGAZINE"
                    ? "PDF uploads only"
                    : "Multiple files/URLs"}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {newContent.type !== "EMAGAZINE" && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      URL
                    </p>
                    <input
                      value={newContentMediaUrlInput}
                      onChange={(e) => setNewContentMediaUrlInput(e.target.value)}
                      className="w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
                      placeholder="https://..."
                    />
                    <select
                      value={newContentMediaTypeInput}
                      onChange={(e) =>
                        setNewContentMediaTypeInput(e.target.value)
                      }
                      className="w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
                    >
                      {MEDIA_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <input
                      value={newContentMediaMimeInput}
                      onChange={(e) => setNewContentMediaMimeInput(e.target.value)}
                      className="w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
                      placeholder="Mime type (optional)"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" variant="secondary" onClick={addQueuedMediaUrl}>
                        Add URL
                      </Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {newContent.type === "EMAGAZINE"
                      ? "Upload PDF"
                      : "Upload files"}
                  </p>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-border-primary bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-white/90">
                    <input
                      type="file"
                      multiple
                      accept={
                        newContent.type === "EMAGAZINE"
                          ? "application/pdf"
                          : "image/*,video/*,application/pdf"
                      }
                      onChange={(e) => addQueuedMediaFiles(e.target.files)}
                      className="hidden"
                    />
                    Upload from file
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Files will upload to R2 after the content is created.
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Pending media
                </p>
                {newContentMediaQueue.length === 0 && (
                  <p className="text-xs text-muted-foreground">None</p>
                )}
                <div className="space-y-2">
                  {newContentMediaQueue.map((item, idx) => (
                    <div
                      key={`${item.url || item.name || idx}-${idx}`}
                      className="flex items-center justify-between rounded-md bg-background-primary px-3 py-2 text-xs"
                    >
                      <div className="truncate">
                        <p className="font-semibold">{item.type}</p>
                        <p className="truncate text-muted-foreground">
                          {item.url || item.name || "file"}
                        </p>
                      </div>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => removeQueuedMedia(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button size="sm" onClick={createContent} disabled={uploadingContentMedia}>
                {uploadingContentMedia ? "Saving..." : "Add content"}
              </Button>
            </div>
          </div>

          {selectedContent && contentDraft && (
            <div className="rounded-lg border border-border-primary bg-background-secondary p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Editing
                  </p>
                  <h3 className="text-xl font-bold">
                    {selectedContent.title || "Untitled"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={contentDraft.status}
                    onChange={(e) =>
                      setContentDraft((p) => ({ ...p, status: e.target.value }))
                    }
                    className="rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
                  >
                    {CONTENT_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    value={contentDraft.type}
                    onChange={(e) =>
                      setContentDraft((p) => ({ ...p, type: e.target.value }))
                    }
                    className="rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <InlineField
                  label="Title"
                  value={contentDraft.title}
                  onChange={(v) =>
                    setContentDraft((p) => ({ ...p, title: v }))
                  }
                />
                <InlineField
                  label="Slug"
                  value={contentDraft.slug}
                  onChange={(v) =>
                    setContentDraft((p) => ({ ...p, slug: v }))
                  }
                />
              </div>
              <div className="mt-4">
                <InlineField
                  label="Body"
                  value={contentDraft.body || ""}
                  onChange={(v) =>
                    setContentDraft((p) => ({ ...p, body: v }))
                  }
                  multiline
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={submitContentUpdate}>Submit changes</Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteContent(selectedContent.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedContent(null);
                    setContentDraft(null);
                    setContentMedia([]);
                    setContentComments([]);
                  }}
                >
                  Close
                </Button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border-primary bg-background-primary p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Media</h4>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => fetchContentMedia(selectedContent.id)}
                    >
                      Refresh
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {contentMedia.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-start justify-between rounded-md border border-border-primary/70 px-3 py-2"
                      >
                        <div className="text-xs">
                          <p className="font-semibold">{m.type}</p>
                          <p className="truncate text-muted-foreground">
                            {m.url}
                          </p>
                        </div>
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => deleteMedia(m.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                    {contentMedia.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No media yet.
                      </p>
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Attach media to this content
                    </p>
                    <div className="grid gap-3">
                      <select
                        value={newMedia.type}
                        onChange={(e) =>
                          setNewMedia((p) => ({ ...p, type: e.target.value }))
                        }
                        className="w-full rounded-md border border-border-primary bg-background-secondary px-3 py-2 text-sm"
                      >
                        {MEDIA_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <InlineField
                        label="URL"
                        value={newMedia.url}
                        onChange={(v) =>
                          setNewMedia((p) => ({ ...p, url: v }))
                        }
                      />
                      <input
                        type="file"
                        accept="image/*,video/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setNewMediaFile(file || null);
                          if (file) {
                            setNewMedia((p) => ({
                              ...p,
                              mimeType: file.type,
                              type: inferMediaType(file.type),
                            }));
                          }
                        }}
                        className="w-full text-sm"
                      />
                      {newMediaFile && (
                        <p className="text-xs text-muted-foreground">
                          Selected: {newMediaFile.name}
                        </p>
                      )}
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={createMedia}
                          disabled={uploadingMedia}
                        >
                          {uploadingMedia ? "Uploading..." : "Add media"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border-primary bg-background-primary p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Comments</h4>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => fetchContentComments(selectedContent.id)}
                    >
                      Refresh
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {contentComments.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-md border border-border-primary/70 px-3 py-2"
                      >
                        <p className="text-xs text-muted-foreground">
                          {c.user?.name || c.user?.email || "User"}
                        </p>
                        <p className="text-sm">{c.text}</p>
                        <div className="mt-2 flex justify-end">
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => deleteComment(c.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {contentComments.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No comments yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="rounded-lg border border-border-primary bg-background-primary p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Events</h3>
              <Button size="sm" variant="secondary" onClick={fetchEvents}>
                Refresh
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-md border border-border-primary/70 bg-background-secondary p-3 space-y-2"
                >
                  {editingEvent?.id === ev.id ? (
                    <div className="space-y-2">
                      <input
                        className="w-full rounded-md border border-border-primary bg-background-primary px-2 py-1 text-sm"
                        value={eventDraft.title}
                        onChange={(e) => setEventDraft((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Title"
                      />
                      <textarea
                        className="w-full rounded-md border border-border-primary bg-background-primary px-2 py-1 text-sm"
                        value={eventDraft.description}
                        onChange={(e) =>
                          setEventDraft((p) => ({ ...p, description: e.target.value }))
                        }
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          className="w-full rounded-md border border-border-primary bg-background-primary px-2 py-1 text-sm"
                          value={eventDraft.date}
                          onChange={(e) =>
                            setEventDraft((p) => ({ ...p, date: e.target.value }))
                          }
                        />
                        <input
                          type="time"
                          className="w-full rounded-md border border-border-primary bg-background-primary px-2 py-1 text-sm"
                          value={eventDraft.time}
                          onChange={(e) =>
                            setEventDraft((p) => ({ ...p, time: e.target.value }))
                          }
                        />
                      </div>
                      <input
                        className="w-full rounded-md border border-border-primary bg-background-primary px-2 py-1 text-sm"
                        value={eventDraft.location}
                        onChange={(e) =>
                          setEventDraft((p) => ({ ...p, location: e.target.value }))
                        }
                        placeholder="Location"
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button size="xs" variant="secondary" onClick={cancelEditEvent}>
                          Cancel
                        </Button>
                        <Button size="xs" onClick={saveEditEvent}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold">{ev.title}</p>
                      <p className="text-xs text-muted-foreground">{ev.date}</p>
                      <p className="text-xs text-muted-foreground">{ev.time}</p>
                      <p className="text-xs text-muted-foreground">{ev.location}</p>
                      <div className="mt-2 flex justify-end gap-2">
                        <Button size="xs" variant="secondary" onClick={() => startEditEvent(ev)}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => deleteEvent(ev.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-sm text-muted-foreground">No events.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border-primary bg-background-primary p-4">
            <h3 className="mb-3 text-lg font-semibold">Quick add event</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <InlineField
                label="Title"
                value={newEvent.title}
                onChange={(v) => setNewEvent((p) => ({ ...p, title: v }))}
              />
              <InlineField
                label="Description"
                value={newEvent.description}
                onChange={(v) =>
                  setNewEvent((p) => ({ ...p, description: v }))
                }
              />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Date
            </p>
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent((p) => ({ ...p, date: e.target.value }))
              }
              className="w-full rounded-md bg-background-secondary px-3 py-2 text-sm outline-none ring-1 ring-border-primary focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Time
            </p>
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) =>
                setNewEvent((p) => ({ ...p, time: e.target.value }))
              }
              className="w-full rounded-md bg-background-secondary px-3 py-2 text-sm outline-none ring-1 ring-border-primary focus:ring-2 focus:ring-primary"
            />
          </div>
              <InlineField
                label="Location"
                value={newEvent.location}
                onChange={(v) => setNewEvent((p) => ({ ...p, location: v }))}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button size="sm" onClick={createEvent}>
                Add event
              </Button>
            </div>
          </div>
        </TabsContent>

        {visibleTabs.includes("editors") && (
          <TabsContent value="editors" className="space-y-6">
            <div className="rounded-lg border border-border-primary bg-background-primary p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Editors</h3>
                <Button size="sm" variant="secondary" onClick={fetchEditors}>
                  Refresh
                </Button>
              </div>
              {error && (
                <div className="mb-3 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                {editors.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-md border border-border-primary/70 bg-background-secondary p-3"
                  >
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Role: {user.role}
                    </p>
                  </div>
                ))}
                {editors.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No editors found.
                  </p>
                )}
              </div>
              <div className="mt-4 rounded-md border border-border-primary/60 bg-background-secondary p-3">
                <p className="text-sm font-semibold">Create editor</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Add the email of the person to grant editor role. On next login, they will be editor.
                </p>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <input
                    type="email"
                    value={newEditorEmail}
                    onChange={(e) => setNewEditorEmail(e.target.value)}
                    placeholder="editor@example.com"
                    className="w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
                  />
                  <Button size="sm" onClick={createEditor}>
                    Make editor
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        )}

        {visibleTabs.includes("members") && (
          <TabsContent value="members" className="space-y-6">
            <div className="rounded-lg border border-border-primary bg-background-primary p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Members</h3>
                <Button size="sm" variant="secondary" onClick={fetchMembers}>
                  Refresh
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-md border border-border-primary/70 bg-background-secondary p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          m.profileImageUrl ||
                          "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                        }
                        alt={m.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.role}</p>
                      </div>
                    </div>
                    {m.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {m.bio}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() =>
                          updateMember(m.id, {
                            name: prompt("Name", m.name) || m.name,
                            role: prompt("Role", m.role) || m.role,
                            bio: prompt("Bio", m.bio || "") ?? m.bio,
                            profileImageUrl:
                              prompt("Profile image URL", m.profileImageUrl || "") ??
                              m.profileImageUrl,
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="destructive"
                        onClick={() => deleteMember(m.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="text-sm text-muted-foreground">No members found.</p>
                )}
              </div>
              <div className="mt-4 rounded-md border border-border-primary/60 bg-background-secondary p-3">
                <p className="text-sm font-semibold">Add member</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <InlineField
                    label="Name"
                    value={newMember.name}
                    onChange={(v) => setNewMember((p) => ({ ...p, name: v }))}
                  />
                  <InlineField
                    label="Role"
                    value={newMember.role}
                    onChange={(v) => setNewMember((p) => ({ ...p, role: v }))}
                  />
                  <InlineField
                    label="Bio"
                    value={newMember.bio}
                    onChange={(v) => setNewMember((p) => ({ ...p, bio: v }))}
                    multiline
                  />
                  <InlineField
                    label="Profile image URL"
                    value={newMember.profileImageUrl}
                    onChange={(v) =>
                      setNewMember((p) => ({ ...p, profileImageUrl: v }))
                    }
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button size="sm" onClick={createMember}>
                    Add member
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        )}

        {visibleTabs.includes("youtube") && (
          <TabsContent value="youtube" className="space-y-6">
            <div className="rounded-lg border border-border-primary bg-background-primary p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">YouTube Media</h3>
                <Button size="sm" variant="secondary" onClick={fetchYoutubeMedia}>
                  Refresh
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {youtubeMedia.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-md border border-border-primary/70 bg-background-secondary p-3 space-y-2"
                  >
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      YOUTUBE
                    </p>
                    <p className="truncate text-sm">{m.url}</p>
                    <div className="flex justify-end">
                      <Button
                        size="xs"
                        variant="destructive"
                        onClick={() => deleteYoutube(m.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {youtubeMedia.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No YouTube media found.
                  </p>
                )}
              </div>
              <div className="mt-4 rounded-md border border-border-primary/60 bg-background-secondary p-3">
                <p className="text-sm font-semibold">Add YouTube link</p>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <input
                    type="url"
                    value={newYoutubeUrl}
                    onChange={(e) => setNewYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    className="w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
                  />
                  <Button size="sm" onClick={createYoutube}>
                    Add
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Paste embeddable YouTube URL (e.g., https://www.youtube.com/embed/VIDEO_ID).
                </p>
              </div>
            </div>
          </TabsContent>
        )}

        {visibleTabs.includes("subscriptions") && (
          <TabsContent value="subscriptions" className="space-y-6">
            <div className="rounded-lg border border-border-primary bg-background-primary p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Subscriptions</h3>
                <Button size="sm" variant="secondary" onClick={fetchSubscriptions}>
                  Refresh
                </Button>
              </div>
              <div className="overflow-hidden rounded-md border border-border-primary/60">
                <div className="grid grid-cols-[2fr_1fr_1.5fr] bg-background-secondary px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                  <span>Email</span>
                  <span>Source</span>
                  <span>Created</span>
                </div>
                <div className="divide-y divide-border-primary/50">
                  {subscriptions.map((s) => (
                    <div
                      key={s.id}
                      className="grid grid-cols-[2fr_1fr_1.5fr_max-content] items-center px-3 py-3 text-sm gap-2"
                    >
                      <span className="truncate">{s.email}</span>
                      <span className="text-muted-foreground">{s.source || "—"}</span>
                      <span className="text-muted-foreground">
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                      <Button
                        size="xs"
                        variant="destructive"
                        onClick={() => deleteSubscription(s.email)}
                      >
                        Unsubscribe
                      </Button>
                    </div>
                  ))}
                  {subscriptions.length === 0 && (
                    <div className="px-3 py-3 text-sm text-muted-foreground">
                      No subscriptions yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

