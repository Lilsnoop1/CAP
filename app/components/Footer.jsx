"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email || "";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  React.useEffect(() => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const effectiveEmail = sessionEmail || email;
    if (!effectiveEmail.trim()) return;
    try {
      setStatus("loading");
      setMessage("");
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: effectiveEmail.trim(), source: "footer" }),
      });
      if (!res.ok) {
        throw new Error("Failed to subscribe.");
      }
      setStatus("success");
      setMessage("You're in! Welcome to the CAP newsletter.");
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
        body: JSON.stringify({ email: effectiveEmail.trim(), source: "footer" }),
      });
      if (!res.ok) throw new Error("Failed to unsubscribe.");
      setStatus("success");
      setMessage("You have been unsubscribed.");
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
    <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[8vw] gap-y-12 pb-12 md:gap-y-16 md:pb-18 lg:grid-cols-[0.75fr_1fr] lg:gap-y-4 lg:pb-20">
          <div className="flex flex-col">
            <a href="/" className="mb-5 md:mb-6">
              <img
                src="/cap-logo.jpg"
                alt="Center for Alternative Perspectives logo"
                className="h-24 w-24 sm:h-35 sm:w-35"
              />
            </a>
            <p className="mb-5 md:mb-6">
              Join our newsletter to stay up to date on features and releases.
            </p>
            <div className="w-full max-w-md">
              <form
                className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] md:gap-y-4"
                onSubmit={handleSubmit}
              >
                {!sessionEmail && (
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                )}
                <Button
                  title="Subscribe"
                  variant="secondary"
                  size="sm"
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full font-semibold shadow-sm hover:shadow"
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
                <div className="flex items-center gap-2 text-xs">
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
                By subscribing you agree to with our Privacy Policy and provide
                consent to receive updates from our company.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-y-10 sm:grid-cols-2 sm:gap-x-6 md:gap-x-8 md:gap-y-4">
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4">Contact</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-text-primary">Location:</span>{" "}
                  123 Main Street, City, Country
                </li>
                <li>
                  <span className="font-medium text-text-primary">Phone:</span>{" "}
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4">Follow us</h2>
              <ul className="flex flex-col items-start">
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <BiLogoFacebookCircle className="size-6" />
                    <span>Facebook</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <BiLogoInstagram className="size-6" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <FaXTwitter className="size-6 p-0.5" />
                    <span>X</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <BiLogoLinkedinSquare className="size-6" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <BiLogoYoutube className="size-6" />
                    <span>Youtube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-black" />
        <div className="flex flex-col-reverse items-start justify-between pb-4 pt-6 text-sm md:flex-row md:items-center md:pb-0 md:pt-8">
          <p className="mt-6 md:mt-0">© 2024 Relume. All rights reserved.</p>
          <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
            <li className="underline">
              <a href="#">Privacy Policy</a>
            </li>
            <li className="underline">
              <a href="#">Terms of Service</a>
            </li>
            <li className="underline">
              <a href="#">Cookies Settings</a>
            </li>
          </ul>
        </div>
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black text-white px-4 py-3 shadow-lg flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg">
              🎉
            </span>
            <div className="text-sm font-semibold leading-snug">{message}</div>
          </div>
        )}
      </div>
    </footer>
  );
}
