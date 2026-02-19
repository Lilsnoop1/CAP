"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Cta32() {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email || "";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!sessionEmail) return;
      try {
        const res = await fetch("/api/subscriptions", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const hasSub = Array.isArray(data?.subscriptions)
          ? data.subscriptions.some((s) => s.email?.toLowerCase() === sessionEmail.toLowerCase())
          : false;
        setIsSubscribed(hasSub);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [sessionEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const effectiveEmail = sessionEmail || email;
    if (!effectiveEmail.trim()) return;
    try {
      setStatus("loading");
      setMessage("");
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: effectiveEmail.trim(),
          source: "cta_stay_in_loop",
        }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setStatus("success");
      setMessage("Subscribed! We’ll keep you in the loop.");
      if (!sessionEmail) setEmail("");
      setIsSubscribed(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2600);
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2600);
    }
  };

  const handleUnsubscribe = async () => {
    const effectiveEmail = sessionEmail || email;
    if (!effectiveEmail.trim()) return;
    try {
      setStatus("loading");
      setMessage("");
      const res = await fetch("/api/subscriptions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: effectiveEmail.trim(),
          source: "cta_stay_in_loop",
        }),
      });
      if (!res.ok) throw new Error("Failed to unsubscribe");
      setStatus("success");
      setMessage("You’ve been unsubscribed.");
      if (!sessionEmail) setEmail("");
      setIsSubscribed(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2600);
    } catch (err) {
      setStatus("error");
      setMessage("Could not unsubscribe. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2600);
    }
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container flex flex-col items-center">
        <div className="mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Stay in the loop
          </h2>
          <p className="md:text-md">
            Get fresh perspectives delivered straight to your inbox every week
          </p>
          <div className="mx-auto mt-6 w-full max-w-sm md:mt-8">
            <form
              className="rb-4 mb-4 grid max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4"
              onSubmit={handleSubmit}
            >
              {!sessionEmail && (
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}
              <Button
                title="Subscribe"
                variant="primary"
                size="sm"
                className="items-center justify-center px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {sessionEmail && (
              <p className="mb-2 text-xs text-muted-foreground">
                Using your signed-in email: {sessionEmail}
              </p>
            )}
            {isSubscribed && (
              <div className="flex items-center gap-2 text-xs justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleUnsubscribe}
                  disabled={status === "loading"}
                  className="rounded-full font-semibold hover:shadow"
                >
                  Unsubscribe
                </Button>
              </div>
            )}
            <p className="text-xs">
              We respect your inbox. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          className="size-full object-cover"
          alt="Global network connections representing staying connected and informed"
        />
      </div>
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-black text-white px-4 py-3 shadow-lg">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg">
            ✨
          </span>
          <div className="text-sm font-semibold leading-snug">{message}</div>
        </div>
      )}
    </section>
  );
}
