"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { Fragment } from "react";
import { RxPencil1 } from "react-icons/rx";
import {
  BiLinkAlt,
  BiLogoFacebookCircle,
  BiLogoLinkedinSquare,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

export default function Content30({
  body,
  authorName = "James Mitchell",
  authorTitle = "Researcher, CAP",
  contentImage,
  tags = [],
  authorAvatar,
  canEdit = false,
  onEditBody,
  onEditContentImage,
}) {
  const paragraphs =
    body && typeof body === "string"
      ? body.split(/\n{2,}/).filter(Boolean)
      : [];

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 flex flex-col gap-y-6 sm:flex-row sm:items-center sm:justify-between md:mb-12 md:gap-y-0">
            <Breadcrumb className="flex items-center">
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
          </div>
          <div className="prose mb-12 md:prose-md lg:prose-lg md:mb-16 lg:mb-20 relative">
            {canEdit && (
              <button
                type="button"
                onClick={onEditBody}
                className="absolute -top-10 right-0 rounded-full border border-border-primary bg-background-primary p-2 text-xs hover:bg-background-secondary"
                title="Edit content"
              >
                <RxPencil1 className="size-4" />
              </button>
            )}
            <Fragment>
              {paragraphs.length ? (
                paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <>
                  <h3>Introduction</h3>
                  <p>
                    Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
                    suspendisse morbi eleifend faucibus eget vestibulum felis.
                    Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam.
                    Mauris posuere vulputate arcu amet, vitae nisi, tellus
                    tincidunt. At feugiat sapien varius id.
                  </p>
                </>
              )}
              <figure className="relative">
                <img
                  src={
                    contentImage ||
                    "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  }
                  alt="Content illustration"
                />
                <figcaption>Image caption goes here</figcaption>
                {canEdit && (
                  <button
                    type="button"
                    onClick={onEditContentImage}
                    className="absolute right-2 top-2 rounded-full border border-border-primary bg-background-primary p-2 text-xs hover:bg-background-secondary"
                    title="Edit content image"
                  >
                    <RxPencil1 className="size-4" />
                  </button>
                )}
              </figure>
            </Fragment>
          </div>
          <div>
            <ul className="flex flex-wrap justify-center gap-2">
              {(tags?.length
                ? tags
                : ["Echo chambers", "Discourse", "Perspectives", "Critical thinking"]
              ).map((tag) => (
                <li className="flex" key={tag}>
                  <span className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="my-8 h-px bg-border-primary md:my-10 lg:my-12" />
          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <img
                src={
                  authorAvatar ||
                  "https://cdn.prod.website-files.com/624380709031623bfe4aee60/6243807090316203124aee66_placeholder-image.svg"
                }
                alt="Logo"
                className="size-14 rounded-full object-cover"
              />
            </div>
            <div className="grow">
              <p className="font-semibold md:text-md">{authorName}</p>
              <p>{authorTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
