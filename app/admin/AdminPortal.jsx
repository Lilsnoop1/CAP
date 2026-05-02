"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdminPortalButton,
  ADMIN_TAB_TRIGGER_CLASS,
} from "@/components/admin/AdminPortalButton";
import PlacesLocationField from "@/components/admin/PlacesLocationField";
import { Spinner } from "@/components/ui/spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  Images,
  Mail,
  Megaphone,
  Newspaper,
  Pencil,
  Plus,
  Shield,
  Trash2,
  Users,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib_/utils";
import { adminPortalButtonVariants } from "@/components/admin/AdminPortalButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CONTENT_TYPES = ["OPED", "ANNOUNCEMENT", "GALLERY", "EMAGAZINE"];
const CONTENT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const MEDIA_TYPES = ["IMAGE", "VIDEO", "PDF"];

const CONTENT_TYPE_ICONS = {
  OPED: Newspaper,
  ANNOUNCEMENT: Megaphone,
  GALLERY: Images,
  EMAGAZINE: BookOpen,
};

/** Short labels for “New …” create buttons */
const CONTENT_TYPE_NEW_LABEL = {
  OPED: "OPED",
  ANNOUNCEMENT: "Announcement",
  GALLERY: "Gallery",
  EMAGAZINE: "E-magazine",
};

const inferMediaType = (mime = "") => {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime === "application/pdf") return "PDF";
  return "IMAGE";
};

/** Surfaces aligned with Content tab styling */
const ADMIN_PANEL_TOOLBAR =
  "rounded-xl border border-border-primary bg-background-primary p-4 shadow-sm";
const ADMIN_PANEL_SECTION =
  "rounded-xl border border-border-primary bg-background-secondary/50 p-4 shadow-sm md:p-5";
const ADMIN_PANEL_SECTION_ACCENT =
  "rounded-xl border-2 border-primary/35 bg-gradient-to-b from-background-primary to-background-secondary/50 p-4 shadow-sm md:p-5";
const ADMIN_ROW_CARD =
  "rounded-lg border border-border-primary bg-background-primary p-4 shadow-sm";
const ADMIN_FORM_CARD =
  "rounded-xl border border-border-primary bg-background-primary p-4 shadow-sm md:p-5";
const ADMIN_EMPTY =
  "rounded-lg border border-dashed border-border-primary bg-background-primary/80 px-4 py-6 text-center text-sm text-muted-foreground";
const ADMIN_ICON_BOX =
  "flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--border-primary)] bg-background-primary text-foreground shadow-sm";
const ADMIN_ICON_BOX_ACCENT =
  "flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm";

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

  const [actionLoading, setActionLoading] = useState({});
  const [notice, setNotice] = useState(null); // { type: "success" | "error" | "info", text: string }
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showEventCreateModal, setShowEventCreateModal] = useState(false);
  const [showEventEditModal, setShowEventEditModal] = useState(false);
  const [showEditorInviteModal, setShowEditorInviteModal] = useState(false);
  const [showMemberCreateModal, setShowMemberCreateModal] = useState(false);
  const [showMemberEditModal, setShowMemberEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberDraft, setMemberDraft] = useState({
    name: "",
    role: "",
    bio: "",
    profileImageUrl: "",
  });
  const [showYoutubeAddModal, setShowYoutubeAddModal] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const runAction = async (key, fn, { successText, errorText } = {}) => {
    setActionLoading((p) => ({ ...p, [key]: true }));
    setError(null);
    try {
      const result = await fn();
      if (successText) setNotice({ type: "success", text: successText });
      return result;
    } catch (err) {
      console.error(err);
      const message =
        errorText || (err instanceof Error ? err.message : "Action failed");
      setNotice({ type: "error", text: message });
      setError(message);
      return null;
    } finally {
      setActionLoading((p) => ({ ...p, [key]: false }));
    }
  };

  const isActionLoading = (key) => !!actionLoading[key];
  const refreshWithLoader = (key, fn) =>
    runAction(key, fn, { errorText: "Failed to refresh" });

  const openCreateModal = (defaultType = "OPED") => {
    setNewContent({
      type: defaultType,
      title: "",
      slug: "",
      body: "",
    });
    setNewContentMediaQueue([]);
    setNewContentMediaUrlInput("");
    setNewContentMediaMimeInput("");
    setError(null);
    setShowCreateModal(true);
  };

  const beginEditContent = (c) => {
    openContent(c);
    setShowEditModal(true);
  };

  const closeEditDialog = () => {
    setShowEditModal(false);
    setSelectedContent(null);
    setContentDraft(null);
    setContentMedia([]);
    setContentComments([]);
  };

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
    await runAction(
      `subscription:delete:${email}`,
      async () => {
        const res = await fetch("/api/subscriptions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Failed to unsubscribe");
        await fetchSubscriptions();
      },
      { successText: "Unsubscribed." }
    );
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
    try {
      setLoading(true);
      const res = await fetch("/api/media");
      if (!res.ok) {
        setMedia([]);
        setError("Failed to fetch media");
        return;
      }
      const data = await res.json();
      setMedia(data?.media || data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events", { credentials: "include" });
      if (!res.ok) {
        setEvents([]);
        const detail = await res.json().catch(() => ({}));
        setError(detail.error || "Failed to fetch events");
        return;
      }
      const data = await res.json();
      setEvents(data?.events || data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const fetchEditors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users?role=EDITOR");
      if (!res.ok) {
        setEditors([]);
        const detail = await res.json().catch(() => ({}));
        setError(detail.error || "Failed to fetch editors");
        return;
      }
      const data = await res.json();
      setEditors(data?.users || data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch editors");
    } finally {
      setLoading(false);
    }
  };

  const groupedContent = useMemo(() => {
    return CONTENT_TYPES.reduce((acc, type) => {
      acc[type] = contents.filter((c) => c.type === type);
      return acc;
    }, {});
  }, [contents]);

  const contentTypesToDisplay = useMemo(() => {
    if (contentFilter === "ALL") return CONTENT_TYPES;
    return CONTENT_TYPES.includes(contentFilter) ? [contentFilter] : CONTENT_TYPES;
  }, [contentFilter]);

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
    await runAction(
      `content:update:${selectedContent.id}`,
      async () => {
        const res = await fetch(`/api/content/${selectedContent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contentDraft),
        });
        if (!res.ok) throw new Error("Failed to update content");
        await fetchContent();
        closeEditDialog();
      },
      { successText: "Content updated." }
    );
  };

  const deleteContent = async (id) => {
    await runAction(
      `content:delete:${id}`,
      async () => {
        const res = await fetch(`/api/content/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) {
          const detail = await res.json().catch(() => ({}));
          throw new Error(detail.error || "Failed to delete content");
        }
        if (selectedContent?.id === id) {
          setShowEditModal(false);
          setSelectedContent(null);
          setContentDraft(null);
          setContentMedia([]);
          setContentComments([]);
        }
        await fetchContent();
      },
      { successText: "Content deleted." }
    );
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
      setShowCreateModal(false);
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
    await runAction(
      selectedContent?.id ? `media:create:${selectedContent.id}` : "media:create",
      async () => {
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

        const res = await fetch("/api/media", {
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
        if (!res.ok) throw new Error("Failed to add media");

        setNewMedia({ type: "IMAGE", url: "", mimeType: "" });
        setNewMediaFile(null);
        if (selectedContent?.id) {
          await fetchContentMedia(selectedContent.id);
        } else {
          await fetchMedia();
        }
      },
      { successText: "Media added." }
    );
    setUploadingMedia(false);
  };

  const deleteMedia = async (id) => {
    await runAction(
      `media:delete:${id}`,
      async () => {
        const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete media");
        if (selectedContent?.id) {
          await fetchContentMedia(selectedContent.id);
        } else {
          await fetchMedia();
        }
      },
      { successText: "Media deleted." }
    );
  };

  const createEditor = async () => {
    const email = newEditorEmail.trim().toLowerCase();
    if (!email) return;
    await runAction(
      `editor:create:${email}`,
      async () => {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role: "EDITOR" }),
        });
        if (!res.ok) {
          const detail = await res.json().catch(() => ({}));
          throw new Error(detail.error || "Failed to create editor");
        }
        setNewEditorEmail("");
        setShowEditorInviteModal(false);
        await fetchEditors();
      },
      { successText: "Editor created." }
    );
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
    await runAction(
      `comment:delete:${commentId}`,
      async () => {
        const res = await fetch(`/api/comments/${commentId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete comment");
        if (selectedContent?.id) {
          await fetchContentComments(selectedContent.id);
        }
      },
      { successText: "Comment deleted." }
    );
  };

  const createEvent = async () => {
    const payload = {
      title: newEvent.title?.trim?.() || "",
      description: newEvent.description?.trim?.() || "",
      date: newEvent.date || "",
      time: newEvent.time || "",
      location: newEvent.location?.trim?.() || "",
    };
    await runAction(
      "event:create",
      async () => {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        if (!res.ok) {
          const detail = await res.json().catch(() => ({}));
          throw new Error(detail.error || "Failed to create event");
        }
        setNewEvent({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
        });
        setShowEventCreateModal(false);
        await fetchEvents();
      },
      { successText: "Event created." }
    );
  };

  const deleteEvent = async (id) => {
    await runAction(
      `event:delete:${id}`,
      async () => {
        const res = await fetch(`/api/events/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to delete event");
        await fetchEvents();
      },
      { successText: "Event deleted." }
    );
  };

  const openEventCreateModal = () => {
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
    });
    setShowEventCreateModal(true);
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
    setShowEventEditModal(true);
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
    setShowEventEditModal(false);
  };

  const saveEditEvent = async () => {
    if (!editingEvent) return;
    const payload = { ...eventDraft };
    await runAction(
      `event:update:${editingEvent.id}`,
      async () => {
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update event");
        setEditingEvent(null);
        setShowEventEditModal(false);
        await fetchEvents();
      },
      { successText: "Event updated." }
    );
  };

  const createYoutube = async () => {
    if (!newYoutubeUrl.trim()) return;
    await runAction(
      "youtube:create",
      async () => {
        const res = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "YOUTUBE", url: newYoutubeUrl.trim() }),
          credentials: "include",
        });
        if (!res.ok) {
          const detail = await res.json().catch(() => ({}));
          throw new Error(detail.error || "Failed to add YouTube link");
        }
        setNewYoutubeUrl("");
        setShowYoutubeAddModal(false);
        await fetchYoutubeMedia();
      },
      { successText: "YouTube link added." }
    );
  };

  const deleteYoutube = async (id) => {
    await runAction(
      `youtube:delete:${id}`,
      async () => {
        const res = await fetch(`/api/media/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to delete YouTube link");
        await fetchYoutubeMedia();
      },
      { successText: "YouTube link deleted." }
    );
  };

  const createMember = async () => {
    if (!newMember.name || !newMember.role) return;
    await runAction(
      "member:create",
      async () => {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMember),
          credentials: "include",
        });
        if (!res.ok) {
          const detail = await res.json().catch(() => ({}));
          throw new Error(detail.error || "Failed to create member");
        }
        setNewMember({ name: "", role: "", bio: "", profileImageUrl: "" });
        setShowMemberCreateModal(false);
        await fetchMembers();
      },
      { successText: "Member created." }
    );
  };

  const beginEditMember = (m) => {
    setEditingMember(m);
    setMemberDraft({
      name: m.name || "",
      role: m.role || "",
      bio: m.bio || "",
      profileImageUrl: m.profileImageUrl || "",
    });
    setShowMemberEditModal(true);
  };

  const cancelEditMember = () => {
    setEditingMember(null);
    setMemberDraft({
      name: "",
      role: "",
      bio: "",
      profileImageUrl: "",
    });
    setShowMemberEditModal(false);
  };

  const saveMemberEdit = async () => {
    if (!editingMember) return;
    await runAction(
      `member:update:${editingMember.id}`,
      async () => {
        const res = await fetch(`/api/members/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memberDraft),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to update member");
        setShowMemberEditModal(false);
        setEditingMember(null);
        await fetchMembers();
      },
      { successText: "Member updated." }
    );
  };

  const deleteMember = async (id) => {
    await runAction(
      `member:delete:${id}`,
      async () => {
        const res = await fetch(`/api/members/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to delete member");
        await fetchMembers();
      },
      { successText: "Member deleted." }
    );
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

      {notice && (
        <div
          className={[
            "mb-4 rounded-md border px-3 py-2 text-sm",
            notice.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : notice.type === "error"
                ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                : "border-border-primary/60 bg-background-secondary text-foreground/90",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <span>{notice.text}</span>
            <AdminPortalButton
              type="button"
              variant="ghost"
              size="xs"
              className="shrink-0 font-semibold"
              onClick={() => setNotice(null)}
            >
              Dismiss
            </AdminPortalButton>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="no-scrollbar mb-4 flex h-auto w-full gap-2 overflow-x-auto bg-transparent p-0">
          {visibleTabs.includes("content") && (
            <TabsTrigger value="content" className={ADMIN_TAB_TRIGGER_CLASS}>
              Content
            </TabsTrigger>
          )}
          {visibleTabs.includes("events") && (
            <TabsTrigger value="events" className={ADMIN_TAB_TRIGGER_CLASS}>
              Events
            </TabsTrigger>
          )}
          {visibleTabs.includes("members") && (
            <TabsTrigger value="members" className={ADMIN_TAB_TRIGGER_CLASS}>
              Members
            </TabsTrigger>
          )}
          {visibleTabs.includes("youtube") && (
            <TabsTrigger value="youtube" className={ADMIN_TAB_TRIGGER_CLASS}>
              YouTube Media
            </TabsTrigger>
          )}
          {visibleTabs.includes("editors") && (
            <TabsTrigger value="editors" className={ADMIN_TAB_TRIGGER_CLASS}>
              Editors
            </TabsTrigger>
          )}
          {visibleTabs.includes("subscriptions") && (
            <TabsTrigger value="subscriptions" className={ADMIN_TAB_TRIGGER_CLASS}>
              Subscriptions
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {error && (
            <div className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className={ADMIN_PANEL_TOOLBAR}>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="grid w-full gap-3 sm:grid-cols-[1fr_minmax(8rem,12rem)] md:max-w-2xl md:flex-1">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Search
                  </p>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchContent()}
                    placeholder="Search titles and slugs…"
                    className="w-full rounded-md border border-border-primary bg-background-secondary px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Type filter
                  </p>
                  <select
                    value={contentFilter}
                    onChange={(e) => setContentFilter(e.target.value)}
                    className="w-full rounded-md border border-border-primary bg-background-secondary px-3 py-2 text-sm"
                  >
                    <option value="ALL">All types</option>
                    {CONTENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <AdminPortalButton
                size="sm"
                variant="secondary"
                className="shrink-0"
                onClick={() => refreshWithLoader("content:refresh", fetchContent)}
                disabled={loading || isActionLoading("content:refresh")}
              >
                {isActionLoading("content:refresh") ? "Refreshing…" : "Refresh list"}
              </AdminPortalButton>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              OPED pieces open at{" "}
              <code className="rounded bg-background-secondary px-1 py-0.5 text-[11px]">
                /article?slug=…
              </code>
              . Use Open to preview, Edit for full fields and media.
            </p>
          </div>

          <div className="space-y-5">
            {contentTypesToDisplay.map((type) => {
              const Icon = CONTENT_TYPE_ICONS[type] || Newspaper;
              const items = groupedContent[type] || [];
              const isOped = type === "OPED";
              return (
                <section
                  key={type}
                  className={cn(
                    "p-4 shadow-sm md:p-5",
                    isOped ? ADMIN_PANEL_SECTION_ACCENT : ADMIN_PANEL_SECTION
                  )}
                >
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div
                        className={cn(
                          isOped ? ADMIN_ICON_BOX_ACCENT : ADMIN_ICON_BOX
                        )}
                      >
                        <Icon className="size-6" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold tracking-tight md:text-xl">
                          {type.replace(/_/g, " ")}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {items.length}{" "}
                          {items.length === 1 ? "article" : "articles"}
                          {isOped
                            ? " — hero uses first attached image; inline figure uses second."
                            : ""}
                        </p>
                      </div>
                    </div>
                    <AdminPortalButton
                      size="sm"
                      variant={isOped ? "default" : "outline"}
                      type="button"
                      className="h-9 w-full shrink-0 justify-center gap-2 px-3 sm:mt-0 sm:w-64"
                      onClick={() => openCreateModal(type)}
                      title={`Create new ${CONTENT_TYPE_NEW_LABEL[type] || type}`}
                    >
                      <Plus className="size-4 shrink-0" aria-hidden />
                      <Icon className="size-4 shrink-0" aria-hidden />
                      <span className="max-w-[10.5rem] truncate text-center text-xs font-semibold sm:max-w-[12rem] sm:text-sm">
                        New {CONTENT_TYPE_NEW_LABEL[type] || type}
                      </span>
                    </AdminPortalButton>
                  </div>

                  <div className="space-y-2">
                    {items.map((c) => (
                      <div
                        key={c.id}
                        className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${ADMIN_ROW_CARD}`}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate text-sm font-semibold">{c.title}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded-full bg-background-secondary px-2 py-0.5 font-semibold text-foreground">
                              {c.status}
                            </span>
                            <span className="truncate font-mono">{c.slug}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <a
                            href={`/article?slug=${encodeURIComponent(c.slug)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              adminPortalButtonVariants({ variant: "secondary", size: "sm" }),
                              "no-underline"
                            )}
                          >
                            <ExternalLink className="size-4" aria-hidden />
                            Open
                          </a>
                          <AdminPortalButton
                            size="sm"
                            variant="outline"
                            onClick={() => beginEditContent(c)}
                          >
                            <Pencil className="size-4" aria-hidden />
                            Edit
                          </AdminPortalButton>
                          <AdminPortalButton
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteContent(c.id)}
                            disabled={isActionLoading(`content:delete:${c.id}`)}
                          >
                            {isActionLoading(`content:delete:${c.id}`) && (
                              <Spinner className="h-3.5 w-3.5" />
                            )}
                            <Trash2 className="size-4" aria-hidden />
                            <span className="hidden sm:inline">
                              {isActionLoading(`content:delete:${c.id}`)
                                ? "Deleting…"
                                : "Delete"}
                            </span>
                          </AdminPortalButton>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <p className={ADMIN_EMPTY}>
                        No {type} items yet.
                        {isOped && (
                          <>
                            {" "}
                            <button
                              type="button"
                              className="font-semibold text-primary underline-offset-2 hover:underline"
                              onClick={() => openCreateModal("OPED")}
                            >
                              Create an OPED article
                            </button>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <Dialog
            open={showCreateModal}
            onOpenChange={(open) => {
              if (!uploadingContentMedia) setShowCreateModal(open);
            }}
          >
            <DialogContent
              className="flex max-h-[92vh] max-w-3xl flex-col gap-0 overflow-hidden bg-[var(--background-primary)] p-0 sm:max-w-3xl"
              onPointerDownOutside={(e) =>
                uploadingContentMedia && e.preventDefault()
              }
              onEscapeKeyDown={(e) => uploadingContentMedia && e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Create content</DialogTitle>
                <DialogDescription>
                  Add title and slug, optional body and media. EMAGAZINE requires at least one PDF.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[min(65vh,560px)] overflow-y-auto bg-[var(--background-primary)] px-6 py-4">
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
                    <div className="md:col-span-2">
                      <InlineField
                        label="Body"
                        value={newContent.body}
                        onChange={(v) =>
                          setNewContent((prev) => ({ ...prev, body: v }))
                        }
                        multiline
                      />
                    </div>
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
                        : "Multiple files or URLs"}
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
                          <AdminPortalButton
                            size="sm"
                            variant="secondary"
                            type="button"
                            onClick={addQueuedMediaUrl}
                          >
                            Add URL
                          </AdminPortalButton>
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
                        Files upload to R2 after the article is created.
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
                          <AdminPortalButton
                            size="xs"
                            variant="ghost"
                            type="button"
                            onClick={() => removeQueuedMedia(idx)}
                          >
                            Remove
                          </AdminPortalButton>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <AdminPortalButton
                  type="button"
                  variant="ghost"
                  onClick={() => !uploadingContentMedia && setShowCreateModal(false)}
                  disabled={uploadingContentMedia}
                >
                  Cancel
                </AdminPortalButton>
                <AdminPortalButton
                  type="button"
                  onClick={createContent}
                  disabled={uploadingContentMedia}
                >
                  {uploadingContentMedia ? "Saving…" : "Create"}
                </AdminPortalButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={showEditModal && !!selectedContent && !!contentDraft}
            onOpenChange={(open) => {
              if (!open) closeEditDialog();
            }}
          >
            <DialogContent
              className="flex max-h-[92vh] max-w-3xl flex-col gap-0 overflow-hidden bg-[var(--background-primary)] p-0 sm:max-w-3xl"
              onPointerDownOutside={(e) => {
                const updating =
                  selectedContent?.id &&
                  isActionLoading(`content:update:${selectedContent.id}`);
                if (updating) e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                const updating =
                  selectedContent?.id &&
                  isActionLoading(`content:update:${selectedContent.id}`);
                if (updating) e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit article</DialogTitle>
                <DialogDescription>
                  {selectedContent?.title || "Untitled"} — update fields, media, and comments.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[min(62vh,520px)] overflow-y-auto bg-[var(--background-primary)] px-6 py-4">
                {selectedContent && contentDraft && (
                  <>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
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
                      <a
                        href={`/article?slug=${encodeURIComponent(selectedContent.slug)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          adminPortalButtonVariants({ variant: "secondary", size: "sm" }),
                          "no-underline"
                        )}
                      >
                        <ExternalLink className="size-4" aria-hidden />
                        Open live
                      </a>
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

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-border-primary bg-background-secondary p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Media</h4>
                          <AdminPortalButton
                            size="xs"
                            variant="secondary"
                            type="button"
                            onClick={() => fetchContentMedia(selectedContent.id)}
                          >
                            Refresh
                          </AdminPortalButton>
                        </div>
                        <div className="space-y-2">
                          {contentMedia.map((m) => (
                            <div
                              key={m.id}
                              className="flex items-start justify-between rounded-md border border-border-primary/70 px-3 py-2"
                            >
                              <div className="min-w-0 text-xs">
                                <p className="font-semibold">{m.type}</p>
                                <p className="truncate text-muted-foreground">{m.url}</p>
                              </div>
                              <AdminPortalButton
                                size="xs"
                                variant="destructive"
                                type="button"
                                onClick={() => deleteMedia(m.id)}
                                disabled={isActionLoading(`media:delete:${m.id}`)}
                              >
                                {isActionLoading(`media:delete:${m.id}`) && (
                                  <Spinner className="h-3.5 w-3.5" />
                                )}
                                {isActionLoading(`media:delete:${m.id}`)
                                  ? "…"
                                  : "Remove"}
                              </AdminPortalButton>
                            </div>
                          ))}
                          {contentMedia.length === 0 && (
                            <p className="text-xs text-muted-foreground">No media yet.</p>
                          )}
                        </div>
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Attach media
                          </p>
                          <div className="grid gap-3">
                            <select
                              value={newMedia.type}
                              onChange={(e) =>
                                setNewMedia((p) => ({ ...p, type: e.target.value }))
                              }
                              className="w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm"
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
                              <AdminPortalButton
                                size="sm"
                                type="button"
                                onClick={createMedia}
                                disabled={uploadingMedia}
                              >
                                {uploadingMedia && <Spinner />}
                                {uploadingMedia ? "Uploading…" : "Add media"}
                              </AdminPortalButton>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border-primary bg-background-secondary p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Comments</h4>
                          <AdminPortalButton
                            size="xs"
                            variant="secondary"
                            type="button"
                            onClick={() => fetchContentComments(selectedContent.id)}
                          >
                            Refresh
                          </AdminPortalButton>
                        </div>
                        <div className="max-h-56 space-y-2 overflow-y-auto">
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
                                <AdminPortalButton
                                  size="xs"
                                  variant="destructive"
                                  type="button"
                                  onClick={() => deleteComment(c.id)}
                                  disabled={isActionLoading(`comment:delete:${c.id}`)}
                                >
                                  {isActionLoading(`comment:delete:${c.id}`) && (
                                    <Spinner className="h-3.5 w-3.5" />
                                  )}
                                  {isActionLoading(`comment:delete:${c.id}`)
                                    ? "…"
                                    : "Delete"}
                                </AdminPortalButton>
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
                  </>
                )}
              </div>
              <DialogFooter>
                <AdminPortalButton
                  type="button"
                  variant="destructive"
                  onClick={() => deleteContent(selectedContent.id)}
                  disabled={isActionLoading(`content:delete:${selectedContent?.id}`)}
                >
                  {isActionLoading(`content:delete:${selectedContent?.id}`) && (
                    <Spinner />
                  )}
                  Delete article
                </AdminPortalButton>
                <AdminPortalButton
                  type="button"
                  variant="ghost"
                  onClick={closeEditDialog}
                  disabled={
                    !!selectedContent?.id &&
                    isActionLoading(`content:update:${selectedContent.id}`)
                  }
                >
                  Close
                </AdminPortalButton>
                <AdminPortalButton
                  type="button"
                  onClick={submitContentUpdate}
                  disabled={
                    selectedContent?.id
                      ? isActionLoading(`content:update:${selectedContent.id}`)
                      : false
                  }
                >
                  {selectedContent?.id &&
                    isActionLoading(`content:update:${selectedContent.id}`) && (
                      <Spinner />
                    )}
                  {selectedContent?.id &&
                  isActionLoading(`content:update:${selectedContent.id}`)
                    ? "Saving…"
                    : "Save changes"}
                </AdminPortalButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {error && (
            <div className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <div className={ADMIN_PANEL_TOOLBAR}>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Events
                </p>
                <h2 className="text-lg font-bold tracking-tight md:text-xl">
                  Schedule & locations
                </h2>
                <p className="text-sm text-muted-foreground">
                  {events.length}{" "}
                  {events.length === 1 ? "event" : "events"} total
                </p>
              </div>
              <AdminPortalButton
                size="sm"
                variant="secondary"
                className="shrink-0"
                onClick={() => refreshWithLoader("events:refresh", fetchEvents)}
                disabled={isActionLoading("events:refresh")}
              >
                {isActionLoading("events:refresh") ? "Refreshing…" : "Refresh list"}
              </AdminPortalButton>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Use <strong className="font-semibold text-foreground">New event</strong> or{" "}
              <strong className="font-semibold text-foreground">Edit</strong> on a card — forms open in a dialog.
            </p>
          </div>

          <section className={ADMIN_PANEL_SECTION}>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className={ADMIN_ICON_BOX}>
                  <Calendar className="size-6" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold tracking-tight md:text-xl">
                    All events
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Published on the public events page when saved.
                  </p>
                </div>
              </div>
              <AdminPortalButton
                type="button"
                size="sm"
                className="w-full shrink-0 justify-center gap-2 sm:w-auto sm:min-w-[11rem]"
                onClick={openEventCreateModal}
              >
                <Plus className="size-4" aria-hidden />
                New event
              </AdminPortalButton>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {events.map((ev) => (
                <div key={ev.id} className={`${ADMIN_ROW_CARD} space-y-2`}>
                  <p className="text-sm font-semibold">{ev.title}</p>
                  <p className="text-xs text-muted-foreground">{ev.date}</p>
                  <p className="text-xs text-muted-foreground">{ev.time}</p>
                  <p className="text-xs text-muted-foreground">{ev.location}</p>
                  <div className="mt-2 flex justify-end gap-2">
                    <AdminPortalButton
                      size="xs"
                      variant="secondary"
                      type="button"
                      onClick={() => startEditEvent(ev)}
                    >
                      Edit
                    </AdminPortalButton>
                    <AdminPortalButton
                      size="xs"
                      variant="destructive"
                      type="button"
                      onClick={() => deleteEvent(ev.id)}
                      disabled={isActionLoading(`event:delete:${ev.id}`)}
                    >
                      {isActionLoading(`event:delete:${ev.id}`) && (
                        <Spinner className="h-3.5 w-3.5" />
                      )}
                      {isActionLoading(`event:delete:${ev.id}`)
                        ? "Deleting…"
                        : "Delete"}
                    </AdminPortalButton>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="md:col-span-2">
                  <p className={ADMIN_EMPTY}>No events yet.</p>
                </div>
              )}
            </div>
          </section>

          <Dialog
            open={showEventCreateModal}
            onOpenChange={(open) => {
              if (!open) setShowEventCreateModal(false);
            }}
          >
            <DialogContent className="flex max-h-[92vh] max-w-3xl flex-col gap-0 overflow-hidden bg-[var(--background-primary)] p-0 sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>New event</DialogTitle>
                <DialogDescription>
                  Title, description, date, time, and a Places-powered location.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[min(65vh,560px)] overflow-y-auto bg-[var(--background-primary)] px-6 py-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <InlineField
                    label="Title"
                    value={newEvent.title}
                    onChange={(v) => setNewEvent((p) => ({ ...p, title: v }))}
                  />
                  <div className="md:col-span-2">
                    <InlineField
                      label="Description"
                      value={newEvent.description}
                      onChange={(v) =>
                        setNewEvent((p) => ({ ...p, description: v }))
                      }
                      multiline
                    />
                  </div>
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
                  <div className="md:col-span-2">
                    <PlacesLocationField
                      key="event-create-loc"
                      label="Location"
                      value={newEvent.location}
                      onChange={(v) => setNewEvent((p) => ({ ...p, location: v }))}
                      placeholder="Search for a venue or address"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <AdminPortalButton
                  type="button"
                  variant="ghost"
                  onClick={() => setShowEventCreateModal(false)}
                  disabled={isActionLoading("event:create")}
                >
                  Cancel
                </AdminPortalButton>
                <AdminPortalButton
                  type="button"
                  onClick={createEvent}
                  disabled={isActionLoading("event:create")}
                >
                  {isActionLoading("event:create") && <Spinner />}
                  {isActionLoading("event:create") ? "Adding…" : "Add event"}
                </AdminPortalButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={showEventEditModal && !!editingEvent}
            onOpenChange={(open) => {
              if (!open) cancelEditEvent();
            }}
          >
            <DialogContent className="flex max-h-[92vh] max-w-3xl flex-col gap-0 overflow-hidden bg-[var(--background-primary)] p-0 sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit event</DialogTitle>
                <DialogDescription>
                  Update fields and save. Location uses Google Places suggestions.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[min(65vh,560px)] overflow-y-auto bg-[var(--background-primary)] px-6 py-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <InlineField
                    label="Title"
                    value={eventDraft.title}
                    onChange={(v) => setEventDraft((p) => ({ ...p, title: v }))}
                  />
                  <div className="md:col-span-2">
                    <InlineField
                      label="Description"
                      value={eventDraft.description}
                      onChange={(v) =>
                        setEventDraft((p) => ({ ...p, description: v }))
                      }
                      multiline
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Date
                    </p>
                    <input
                      type="date"
                      value={eventDraft.date}
                      onChange={(e) =>
                        setEventDraft((p) => ({ ...p, date: e.target.value }))
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
                      value={eventDraft.time}
                      onChange={(e) =>
                        setEventDraft((p) => ({ ...p, time: e.target.value }))
                      }
                      className="w-full rounded-md bg-background-secondary px-3 py-2 text-sm outline-none ring-1 ring-border-primary focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <PlacesLocationField
                      key={`event-edit-loc-${editingEvent?.id}`}
                      label="Location"
                      value={eventDraft.location}
                      onChange={(v) =>
                        setEventDraft((p) => ({ ...p, location: v }))
                      }
                      placeholder="Search for a venue or address"
                      inputClassName="w-full rounded-md border border-border-primary bg-background-primary px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <AdminPortalButton
                  type="button"
                  variant="ghost"
                  onClick={cancelEditEvent}
                  disabled={
                    editingEvent?.id
                      ? isActionLoading(`event:update:${editingEvent.id}`)
                      : false
                  }
                >
                  Cancel
                </AdminPortalButton>
                <AdminPortalButton
                  type="button"
                  onClick={saveEditEvent}
                  disabled={
                    editingEvent?.id
                      ? isActionLoading(`event:update:${editingEvent.id}`)
                      : false
                  }
                >
                  {editingEvent?.id &&
                    isActionLoading(`event:update:${editingEvent.id}`) && (
                      <Spinner className="h-3.5 w-3.5" />
                    )}
                  {editingEvent?.id &&
                  isActionLoading(`event:update:${editingEvent.id}`)
                    ? "Saving…"
                    : "Save changes"}
                </AdminPortalButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {visibleTabs.includes("editors") && (
          <TabsContent value="editors" className="space-y-6">
            {error && (
              <div className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <div className={ADMIN_PANEL_TOOLBAR}>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Editors
                  </p>
                  <h2 className="text-lg font-bold tracking-tight md:text-xl">
                    Roles & access
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editors.length}{" "}
                    {editors.length === 1 ? "editor" : "editors"}
                  </p>
                </div>
                <AdminPortalButton
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => refreshWithLoader("editors:refresh", fetchEditors)}
                  disabled={isActionLoading("editors:refresh")}
                >
                  {isActionLoading("editors:refresh") ? "Refreshing…" : "Refresh list"}
                </AdminPortalButton>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Editors can manage content like you; admins manage editors here.
              </p>
            </div>

            <section className={ADMIN_PANEL_SECTION}>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className={ADMIN_ICON_BOX}>
                    <Shield className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold tracking-tight md:text-xl">
                      Editor accounts
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Users with the EDITOR role.
                    </p>
                  </div>
                </div>
                <AdminPortalButton
                  type="button"
                  size="sm"
                  className="w-full shrink-0 justify-center gap-2 sm:w-auto sm:min-w-[11rem]"
                  onClick={() => {
                    setNewEditorEmail("");
                    setShowEditorInviteModal(true);
                  }}
                >
                  <Plus className="size-4" aria-hidden />
                  Invite editor
                </AdminPortalButton>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {editors.map((user) => (
                  <div key={user.id} className={`${ADMIN_ROW_CARD} space-y-1`}>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground break-all">
                      {user.email}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      Role: {user.role}
                    </p>
                  </div>
                ))}
                {editors.length === 0 && (
                  <div className="md:col-span-2">
                    <p className={ADMIN_EMPTY}>No editors found.</p>
                  </div>
                )}
              </div>
            </section>

            <Dialog
              open={showEditorInviteModal}
              onOpenChange={(open) => {
                if (!open) setShowEditorInviteModal(false);
              }}
            >
              <DialogContent className="flex max-h-[92vh] max-w-lg flex-col gap-0 overflow-hidden bg-[var(--background-primary)] p-0 sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Grant editor role</DialogTitle>
                  <DialogDescription>
                    Enter their Google account email. On next sign-in they will have
                    EDITOR access.
                  </DialogDescription>
                </DialogHeader>
                <div className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Email
                    </p>
                    <input
                      type="email"
                      value={newEditorEmail}
                      onChange={(e) => setNewEditorEmail(e.target.value)}
                      placeholder="editor@example.com"
                      className="w-full rounded-md border border-border-primary bg-background-secondary px-3 py-2 text-sm outline-none ring-1 ring-border-primary focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <AdminPortalButton
                    type="button"
                    variant="ghost"
                    onClick={() => setShowEditorInviteModal(false)}
                  >
                    Cancel
                  </AdminPortalButton>
                  <AdminPortalButton
                    type="button"
                    onClick={createEditor}
                    disabled={
                      !newEditorEmail?.trim() ||
                      isActionLoading(
                        `editor:create:${newEditorEmail.trim().toLowerCase()}`
                      )
                    }
                  >
                    {newEditorEmail?.trim() &&
                      isActionLoading(
                        `editor:create:${newEditorEmail.trim().toLowerCase()}`
                      ) && <Spinner />}
                    {newEditorEmail?.trim() &&
                    isActionLoading(
                      `editor:create:${newEditorEmail.trim().toLowerCase()}`
                    )
                      ? "Saving…"
                      : "Make editor"}
                  </AdminPortalButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        )}

        {visibleTabs.includes("members") && (
          <TabsContent value="members" className="space-y-6">
            <div className={ADMIN_PANEL_TOOLBAR}>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Members
                  </p>
                  <h2 className="text-lg font-bold tracking-tight md:text-xl">
                    Directory
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {members.length}{" "}
                    {members.length === 1 ? "profile" : "profiles"}
                  </p>
                </div>
                <AdminPortalButton
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => refreshWithLoader("members:refresh", fetchMembers)}
                  disabled={isActionLoading("members:refresh")}
                >
                  {isActionLoading("members:refresh") ? "Refreshing…" : "Refresh list"}
                </AdminPortalButton>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Public-facing member bios (e.g. team page). Add and edit open in dialogs.
              </p>
            </div>

            <section className={ADMIN_PANEL_SECTION}>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className={ADMIN_ICON_BOX}>
                    <Users className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold tracking-tight md:text-xl">
                      All members
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Name, role, bio, and profile image URL.
                    </p>
                  </div>
                </div>
                <AdminPortalButton
                  type="button"
                  size="sm"
                  className="w-full shrink-0 justify-center gap-2 sm:w-auto sm:min-w-[11rem]"
                  onClick={() => {
                    setNewMember({
                      name: "",
                      role: "",
                      bio: "",
                      profileImageUrl: "",
                    });
                    setShowMemberCreateModal(true);
                  }}
                >
                  <Plus className="size-4" aria-hidden />
                  Add member
                </AdminPortalButton>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className={`${ADMIN_ROW_CARD} space-y-2`}
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
                      <AdminPortalButton
                        size="xs"
                        variant="secondary"
                        type="button"
                        onClick={() => beginEditMember(m)}
                        disabled={isActionLoading(`member:update:${m.id}`)}
                      >
                        {isActionLoading(`member:update:${m.id}`) && (
                          <Spinner className="h-3.5 w-3.5" />
                        )}
                        {isActionLoading(`member:update:${m.id}`)
                          ? "Saving…"
                          : "Edit"}
                      </AdminPortalButton>
                      <AdminPortalButton
                        size="xs"
                        variant="destructive"
                        onClick={() => deleteMember(m.id)}
                        disabled={isActionLoading(`member:delete:${m.id}`)}
                      >
                        {isActionLoading(`member:delete:${m.id}`) && (
                          <Spinner className="h-3.5 w-3.5" />
                        )}
                        {isActionLoading(`member:delete:${m.id}`)
                          ? "Deleting…"
                          : "Delete"}
                      </AdminPortalButton>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <p className={ADMIN_EMPTY}>No members found.</p>
                  </div>
                )}
              </div>
            </section>

            <Dialog
              open={showMemberCreateModal}
              onOpenChange={(open) => {
                if (!open) setShowMemberCreateModal(false);
              }}
            >
              <DialogContent className="flex max-h-[92vh] max-w-3xl flex-col gap-0 overflow-hidden bg-[var(--background-primary)] p-0 sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add member</DialogTitle>
                  <DialogDescription>
                    Creates a public directory entry (name, role, bio, image URL).
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[min(65vh,560px)] overflow-y-auto bg-[var(--background-primary)] px-6 py-4">
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
                    <div className="md:col-span-2">
                      <InlineField
                        label="Bio"
                        value={newMember.bio}
                        onChange={(v) => setNewMember((p) => ({ ...p, bio: v }))}
                        multiline
                      />
                    </div>
                    <InlineField
                      label="Profile image URL"
                      value={newMember.profileImageUrl}
                      onChange={(v) =>
                        setNewMember((p) => ({ ...p, profileImageUrl: v }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <AdminPortalButton
                    type="button"
                    variant="ghost"
                    onClick={() => setShowMemberCreateModal(false)}
                    disabled={isActionLoading("member:create")}
                  >
                    Cancel
                  </AdminPortalButton>
                  <AdminPortalButton
                    type="button"
                    onClick={createMember}
                    disabled={isActionLoading("member:create")}
                  >
                    {isActionLoading("member:create") && <Spinner />}
                    {isActionLoading("member:create") ? "Adding…" : "Add member"}
                  </AdminPortalButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showMemberEditModal && !!editingMember}
              onOpenChange={(open) => {
                if (!open) cancelEditMember();
              }}
            >
              <DialogContent className="flex max-h-[92vh] max-w-3xl flex-col gap-0 overflow-hidden bg-[var(--background-primary)] p-0 sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Edit member</DialogTitle>
                  <DialogDescription>
                    Update directory fields and save.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[min(65vh,560px)] overflow-y-auto bg-[var(--background-primary)] px-6 py-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <InlineField
                      label="Name"
                      value={memberDraft.name}
                      onChange={(v) =>
                        setMemberDraft((p) => ({ ...p, name: v }))
                      }
                    />
                    <InlineField
                      label="Role"
                      value={memberDraft.role}
                      onChange={(v) =>
                        setMemberDraft((p) => ({ ...p, role: v }))
                      }
                    />
                    <div className="md:col-span-2">
                      <InlineField
                        label="Bio"
                        value={memberDraft.bio}
                        onChange={(v) =>
                          setMemberDraft((p) => ({ ...p, bio: v }))
                        }
                        multiline
                      />
                    </div>
                    <InlineField
                      label="Profile image URL"
                      value={memberDraft.profileImageUrl}
                      onChange={(v) =>
                        setMemberDraft((p) => ({ ...p, profileImageUrl: v }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <AdminPortalButton
                    type="button"
                    variant="ghost"
                    onClick={cancelEditMember}
                    disabled={
                      editingMember?.id
                        ? isActionLoading(`member:update:${editingMember.id}`)
                        : false
                    }
                  >
                    Cancel
                  </AdminPortalButton>
                  <AdminPortalButton
                    type="button"
                    onClick={saveMemberEdit}
                    disabled={
                      editingMember?.id
                        ? isActionLoading(`member:update:${editingMember.id}`)
                        : false
                    }
                  >
                    {editingMember?.id &&
                      isActionLoading(`member:update:${editingMember.id}`) && (
                        <Spinner className="h-3.5 w-3.5" />
                      )}
                    {editingMember?.id &&
                    isActionLoading(`member:update:${editingMember.id}`)
                      ? "Saving…"
                      : "Save changes"}
                  </AdminPortalButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        )}

        {visibleTabs.includes("youtube") && (
          <TabsContent value="youtube" className="space-y-6">
            <div className={ADMIN_PANEL_TOOLBAR}>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    YouTube
                  </p>
                  <h2 className="text-lg font-bold tracking-tight md:text-xl">
                    Embedded media
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {youtubeMedia.length}{" "}
                    {youtubeMedia.length === 1 ? "link" : "links"}
                  </p>
                </div>
                <AdminPortalButton
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => refreshWithLoader("youtube:refresh", fetchYoutubeMedia)}
                  disabled={isActionLoading("youtube:refresh")}
                >
                  {isActionLoading("youtube:refresh") ? "Refreshing…" : "Refresh list"}
                </AdminPortalButton>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Store embed-ready URLs — use <strong className="font-semibold text-foreground">Add link</strong> on the library card.
              </p>
            </div>

            <section className={ADMIN_PANEL_SECTION}>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className={ADMIN_ICON_BOX}>
                    <Youtube className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold tracking-tight md:text-xl">
                      Library
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Delete entries you no longer need.
                    </p>
                  </div>
                </div>
                <AdminPortalButton
                  type="button"
                  size="sm"
                  className="w-full shrink-0 justify-center gap-2 sm:w-auto sm:min-w-[11rem]"
                  onClick={() => {
                    setNewYoutubeUrl("");
                    setShowYoutubeAddModal(true);
                  }}
                >
                  <Plus className="size-4" aria-hidden />
                  Add link
                </AdminPortalButton>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {youtubeMedia.map((m) => (
                  <div
                    key={m.id}
                    className={`${ADMIN_ROW_CARD} space-y-2`}
                  >
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      YOUTUBE
                    </p>
                    <p className="truncate text-sm">{m.url}</p>
                    <div className="flex justify-end">
                      <AdminPortalButton
                        size="xs"
                        variant="destructive"
                        onClick={() => deleteYoutube(m.id)}
                        disabled={isActionLoading(`youtube:delete:${m.id}`)}
                      >
                        {isActionLoading(`youtube:delete:${m.id}`) && (
                          <Spinner className="h-3.5 w-3.5" />
                        )}
                        {isActionLoading(`youtube:delete:${m.id}`)
                          ? "Deleting…"
                          : "Delete"}
                      </AdminPortalButton>
                    </div>
                  </div>
                ))}
                {youtubeMedia.length === 0 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <p className={ADMIN_EMPTY}>No YouTube media yet.</p>
                  </div>
                )}
              </div>
            </section>

            <Dialog
              open={showYoutubeAddModal}
              onOpenChange={(open) => {
                if (!open) setShowYoutubeAddModal(false);
              }}
            >
              <DialogContent className="flex max-h-[92vh] max-w-lg flex-col gap-0 overflow-hidden bg-[var(--background-primary)] p-0 sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add YouTube embed</DialogTitle>
                  <DialogDescription>
                    Paste an embed-ready URL so players work site-wide.
                  </DialogDescription>
                </DialogHeader>
                <div className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      URL
                    </p>
                    <input
                      type="url"
                      value={newYoutubeUrl}
                      onChange={(e) => setNewYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      className="w-full rounded-md border border-border-primary bg-background-secondary px-3 py-2 text-sm outline-none ring-1 ring-border-primary focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Example:{" "}
                    <code className="rounded bg-background-secondary px-1 py-0.5 text-[11px]">
                      https://www.youtube.com/embed/VIDEO_ID
                    </code>
                  </p>
                </div>
                <DialogFooter>
                  <AdminPortalButton
                    type="button"
                    variant="ghost"
                    onClick={() => setShowYoutubeAddModal(false)}
                    disabled={isActionLoading("youtube:create")}
                  >
                    Cancel
                  </AdminPortalButton>
                  <AdminPortalButton
                    type="button"
                    onClick={createYoutube}
                    disabled={
                      !newYoutubeUrl.trim() || isActionLoading("youtube:create")
                    }
                  >
                    {isActionLoading("youtube:create") && <Spinner />}
                    {isActionLoading("youtube:create") ? "Adding…" : "Add link"}
                  </AdminPortalButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        )}

        {visibleTabs.includes("subscriptions") && (
          <TabsContent value="subscriptions" className="space-y-6">
            <div className={ADMIN_PANEL_TOOLBAR}>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Subscriptions
                  </p>
                  <h2 className="text-lg font-bold tracking-tight md:text-xl">
                    Mailing list
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {subscriptions.length}{" "}
                    {subscriptions.length === 1 ? "subscriber" : "subscribers"}
                  </p>
                </div>
                <AdminPortalButton
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                  onClick={() =>
                    refreshWithLoader("subscriptions:refresh", fetchSubscriptions)
                  }
                  disabled={isActionLoading("subscriptions:refresh")}
                >
                  {isActionLoading("subscriptions:refresh")
                    ? "Refreshing…"
                    : "Refresh list"}
                </AdminPortalButton>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Remove addresses to honor unsubscribe requests.
              </p>
            </div>

            <section className={ADMIN_PANEL_SECTION}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className={ADMIN_ICON_BOX}>
                    <Mail className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold tracking-tight md:text-xl">
                      Subscribers
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Email, optional source label, and signup time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-border-primary bg-background-primary shadow-sm">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.25fr)_auto] gap-2 border-b border-border-primary bg-background-secondary px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Email</span>
                  <span>Source</span>
                  <span className="hidden sm:block">Created</span>
                  <span className="text-right sm:text-left"> </span>
                </div>
                <div className="divide-y divide-border-primary/60">
                  {subscriptions.map((s) => (
                    <div
                      key={s.id}
                      className="grid grid-cols-1 items-start gap-3 px-4 py-4 text-sm sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.25fr)_auto] sm:items-center"
                    >
                      <span className="break-all font-medium">{s.email}</span>
                      <span className="text-muted-foreground">
                        {s.source || "—"}
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                      <div className="flex justify-end sm:justify-start">
                        <AdminPortalButton
                          size="xs"
                          variant="destructive"
                          onClick={() => deleteSubscription(s.email)}
                          disabled={isActionLoading(
                            `subscription:delete:${s.email}`
                          )}
                        >
                          {isActionLoading(`subscription:delete:${s.email}`) && (
                            <Spinner className="h-3.5 w-3.5" />
                          )}
                          {isActionLoading(`subscription:delete:${s.email}`)
                            ? "…"
                            : "Remove"}
                        </AdminPortalButton>
                      </div>
                    </div>
                  ))}
                  {subscriptions.length === 0 && (
                    <div className={ADMIN_EMPTY}>No subscriptions yet.</div>
                  )}
                </div>
              </div>
            </section>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

