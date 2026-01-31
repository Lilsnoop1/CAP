"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";

const useCarouselState = () => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setCount(api.scrollSnapList().length);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const dotClassName = (index) =>
    `mx-[3px] inline-block size-2 rounded-full ${
      current === index ? "bg-black" : "bg-neutral-light"
    }`;

  return { api, setApi, current, count, dotClassName };
};

export default function Gallery25({ media = [] }) {
  const carousel = useCarouselState();
  const items = media.length ? media : [];

  return (
    <section id="relume" className="overflow-hidden py-16 md:py-24 lg:py-28">
      <div className="grid auto-cols-fr grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-0">
        <div className="flex lg:justify-self-end">
          <div className="mx-[5%] w-full max-w-md lg:mb-24 lg:ml-[5vw] lg:mr-20">
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Image Gallery
            </h2>
            <p className="md:text-md">
              A mix of featured videos and images from our media library.
            </p>
          </div>
        </div>
        <Carousel
          setApi={carousel.setApi}
          opts={{ loop: true, align: "start" }}
          className="overflow-hidden px-[5%] lg:px-0"
        >
          <CarouselContent className="ml-0">
            {items.map((m, idx) => (
              <CarouselItem
                key={m.id || idx}
                className="basis-[95%] pl-0 pr-6 sm:basis-4/5 md:basis-1/2 md:pr-8 lg:basis-4/5"
              >
                <div className="overflow-hidden rounded-lg border border-border-primary">
                  {m.type === "YOUTUBE" ? (
                    <div className="aspect-video">
                      <iframe
                        src={m.url}
                        title={m.url}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <img
                      src={
                        m.url ||
                        "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                      }
                      alt={m.type || "media"}
                      className="size-full object-cover"
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
            {items.length === 0 && (
              <CarouselItem className="basis-[95%] pl-0 pr-6 sm:basis-4/5 md:basis-1/2 md:pr-8 lg:basis-4/5">
                <div className="overflow-hidden rounded-lg border border-border-primary">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Placeholder"
                    className="size-full object-cover"
                  />
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <div className="mt-12 flex items-center justify-between">
            <div className="flex gap-2 md:gap-4">
              <CarouselPrevious className="static left-0 top-0 size-12 -translate-y-0" />
              <CarouselNext className="static left-0 top-0 size-12 -translate-y-0" />
            </div>
            <div className="absolute right-[5%] mt-5 flex items-center justify-end md:right-8 lg:right-16">
              {Array.from({ length: Math.max(items.length || 1, carousel.count || 0) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => carousel.api?.scrollTo(index)}
                    className={carousel.dotClassName(index)}
                  />
                )
              )}
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}

