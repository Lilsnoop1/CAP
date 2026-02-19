"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { RxPencil1 } from "react-icons/rx";
import {
  BiLinkAlt,
  BiLogoFacebookCircle,
  BiLogoLinkedinSquare,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

export default function BlogPostHeader({
  title = "The world doesn't need another echo chamber",
  authorName = "James Mitchell",
  publishedAt,
  heroImage = "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  canEdit = false,
  onEditTitle,
  onEditHero,
}) {
  const dateLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString()
    : "15 Mar 2024";

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid gap-x-20 gap-y-12 md:grid-cols-[.75fr_1fr]">
          <div className="mx-auto flex size-full max-w-lg flex-col items-start justify-start">
            <Breadcrumb className="mb-6 flex w-full items-center md:mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Articles</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Ideas</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mb-8 flex items-center gap-3 md:mb-10 lg:mb-12">
              <h1 className="text-5xl font-bold md:text-7xl lg:text-8xl">
                {title}
              </h1>
              {canEdit && (
                <button
                  type="button"
                  onClick={onEditTitle}
                  className="rounded-full border border-border-primary bg-background-primary p-2 text-xs hover:bg-background-secondary"
                  title="Edit title"
                >
                  <RxPencil1 className="size-4" />
                </button>
              )}
            </div>
            <div className="flex size-full flex-col items-start justify-start">
              <div className="rb-4 mb-6 flex items-center md:mb-8">
                <div>
                  <h6 className="font-semibold">
                    <span className="font-normal">By</span> {authorName}
                  </h6>
                  <div className="mt-1 flex">
                    <p className="text-sm">{dateLabel}</p>
                    <span className="mx-2">•</span>
                    <p className="text-sm">7 min read</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-base font-semibold">Share this article</p>
                <div className="rt-4 mt-3 grid grid-flow-col grid-cols-[max-content] items-start gap-2 md:mt-4">
                  <a
                    href="#"
                    className="rounded-[1.25rem] bg-background-secondary p-1"
                  >
                    <BiLinkAlt className="size-6" />
                  </a>
                  <a
                    href="#"
                    className="rounded-[1.25rem] bg-background-secondary p-1"
                  >
                    <BiLogoLinkedinSquare className="size-6" />
                  </a>
                  <a
                    href="#"
                    className="rounded-[1.25rem] bg-background-secondary p-1"
                  >
                    <FaXTwitter className="size-6 p-0.5" />
                  </a>
                  <a
                    href="#"
                    className="rounded-[1.25rem] bg-background-secondary p-1"
                  >
                    <BiLogoFacebookCircle className="size-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto w-full overflow-hidden relative">
            <img
              src={
                heroImage ||
                "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              }
              className="aspect-[3/2] size-full object-cover"
              alt="Relume placeholder image"
            />
            {canEdit && (
              <button
                type="button"
                onClick={onEditHero}
                className="absolute right-3 top-3 rounded-full border border-border-primary bg-background-primary p-2 text-xs hover:bg-background-secondary"
                title="Edit hero image"
              >
                <RxPencil1 className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
