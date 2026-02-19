"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/lib_/hooks";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { RxChevronDown } from "react-icons/rx";

const useRelume = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const openOnMobileDropdownMenu = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const openOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(true);
  };
  const closeOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(false);
  };
  const animateMobileMenu = isMobileMenuOpen ? "open" : "close";
  const animateMobileMenuButtonSpan = isMobileMenuOpen
    ? ["open", "rotatePhase"]
    : "closed";
  const animateDropdownMenu = isDropdownOpen ? "open" : "close";
  const animateDropdownMenuIcon = isDropdownOpen ? "rotated" : "initial";
  return {
    toggleMobileMenu,
    openOnDesktopDropdownMenu,
    closeOnDesktopDropdownMenu,
    openOnMobileDropdownMenu,
    animateMobileMenu,
    animateMobileMenuButtonSpan,
    animateDropdownMenu,
    animateDropdownMenuIcon,
  };
};

export default function Navbar() {
  const useActive = useRelume();
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const navLinkClass = (href) => {
    const isActive = pathname === href;
    return `block py-3 text-md first:pt-7 lg:px-4 lg:py-2 lg:text-base first:lg:pt-2 cursor-pointer border-b-2 ${
      isActive
        ? "border-primary text-primary"
        : "border-transparent hover:border-primary/50"
    }`;
  };

  const userName =
    session?.user?.name ||
    session?.user?.email?.split?.("@")?.[0] ||
    "Account";
  const userImage = session?.user?.image;

  return (
    <section
      id="relume"
      className="flex w-full items-center border-b border-border-primary bg-background-primary lg:min-h-18 lg:px-[5%]"
    >
      <div className="size-full lg:flex lg:items-center lg:justify-between">
        <div className="flex min-h-16 items-center justify-between px-[5%] md:min-h-18 lg:min-h-full lg:px-0">
          <Link href="/">
            <img
              src="/cap-logo.jpg"
              alt="Center for Alternative Perspectives logo"
              className="h-24 w-24 sm:h-35 sm:w-35"
            />
          </Link>
          <button
            className="-mr-2 flex size-12 flex-col items-center justify-center lg:hidden"
            onClick={useActive.toggleMobileMenu}
          >
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={useActive.animateMobileMenuButtonSpan}
              variants={{
                open: { translateY: 8, transition: { delay: 0.1 } },
                rotatePhase: { rotate: -45, transition: { delay: 0.2 } },
                closed: {
                  translateY: 0,
                  rotate: 0,
                  transition: { duration: 0.2 },
                },
              }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={useActive.animateMobileMenu}
              variants={{
                open: { width: 0, transition: { duration: 0.1 } },
                closed: {
                  width: "1.5rem",
                  transition: { delay: 0.3, duration: 0.2 },
                },
              }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={useActive.animateMobileMenuButtonSpan}
              variants={{
                open: { translateY: -8, transition: { delay: 0.1 } },
                rotatePhase: { rotate: 45, transition: { delay: 0.2 } },
                closed: {
                  translateY: 0,
                  rotate: 0,
                  transition: { duration: 0.2 },
                },
              }}
            />
          </button>
        </div>
        <motion.div
          variants={{
            open: { height: "var(--height-open, 100dvh)" },
            close: { height: "var(--height-closed, 0)" },
          }}
          initial="close"
          exit="close"
          animate={useActive.animateMobileMenu}
          transition={{ duration: 0.4 }}
          className="overflow-hidden px-[5%] lg:flex lg:items-center lg:px-0 lg:[--height-closed:auto] lg:[--height-open:auto] lg:overflow-visible"
        >
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>
          <Link href="/about" className={navLinkClass("/about")}>
            About
          </Link>
          <Link href="/events" className={navLinkClass("/events")}>
            Events
          </Link>
          <Link href="/membership" className={navLinkClass("/membership")}>
            Membership
          </Link>
          <Link href="/social" className={navLinkClass("/social")}>
            Social Media
          </Link>
          <Link href="/contact" className={navLinkClass("/contact")}>
            Contact
          </Link>
          <div
            onMouseEnter={useActive.openOnDesktopDropdownMenu}
            onMouseLeave={useActive.closeOnDesktopDropdownMenu}
          >
            <button
              className={`flex w-full items-center justify-between gap-2 py-3 text-left text-md lg:flex-none lg:justify-start lg:px-4 lg:py-2 lg:text-base cursor-pointer border-b-2 ${
                pathname?.startsWith("/publication") ||
                pathname?.startsWith("/trending-articles")
                  ? "border-primary text-primary"
                  : "border-transparent hover:border-primary/50"
              }`}
              onClick={useActive.openOnMobileDropdownMenu}
            >
              <span>Publications</span>
              <motion.span
                variants={{ rotated: { rotate: 180 }, initial: { rotate: 0 } }}
                animate={useActive.animateDropdownMenuIcon}
                transition={{ duration: 0.3 }}
              >
                <RxChevronDown />
              </motion.span>
            </button>
            <AnimatePresence>
              <motion.nav
                variants={{
                  open: {
                    visibility: "visible",
                    opacity: "var(--opacity-open, 100%)",
                    display: "block",
                    y: 0,
                  },
                  close: {
                    visibility: "hidden",
                    opacity: "var(--opacity-close, 0)",
                    display: "none",
                    y: "var(--y-close, 0%)",
                  },
                }}
                animate={useActive.animateDropdownMenu}
                initial="close"
                exit="close"
                transition={{ duration: 0.2 }}
                className="bg-background-primary lg:absolute lg:z-50 lg:border lg:border-border-primary lg:p-2 lg:[--y-close:25%]"
              >
                <Link
                  href="https://journal.capthinktank.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-3 pl-[5%] text-md lg:px-4 lg:py-2 lg:text-base"
                >
                  Journal
                </Link>
                <Link
                  href="/publication"
                  className="block py-3 pl-[5%] text-md lg:px-4 lg:py-2 lg:text-base"
                >
                  Content
                </Link>
              </motion.nav>
            </AnimatePresence>
          </div>
          {(status === "authenticated" &&
            (session?.user?.role === "ADMIN" ||
              session?.user?.role === "EDITOR")) && (
            <Link href="/admin" className={navLinkClass("/admin")}>
              Portal
            </Link>
          )}
          <div className="mt-6 flex flex-col items-center gap-4 lg:ml-4 lg:mt-0 lg:flex-row">
            {status === "authenticated" ? (
              <div className="relative w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((open) => !open)}
                  className="flex w-full items-center justify-between gap-3 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground shadow-sm transition hover:bg-secondary/90 lg:w-auto"
                >
                  <span className="flex items-center gap-2">
                    {userImage ? (
                      <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary">
                        <Image
                          src={userImage}
                          alt={userName}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                          unoptimized
                        />
                      </span>
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {userName?.[0]?.toUpperCase?.() || "U"}
                      </span>
                    )}
                    <span className="truncate font-medium">{userName}</span>
                  </span>
                  <RxChevronDown
                    className={`shrink-0 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isProfileOpen ? (
                  <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[14rem] overflow-hidden rounded-lg bg-secondary text-secondary-foreground shadow-lg lg:w-auto">
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-100/60"
                    >
                      Log Out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="w-full rounded-full px-4 py-2 font-semibold shadow-sm hover:shadow"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Sign in with Google
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
