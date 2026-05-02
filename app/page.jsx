"use server";
import React, { Suspense } from "react";
import Cta27 from "./components/Cta27.jsx";
import Cta32 from "./components/Cta32.jsx";
import Header30 from "./components/Header30.jsx";
import LoadingGrid from "./components/LoadingGrid.jsx";
import EventsSection from "./page/EventsSection.jsx";
import OpedSection from "./page/OpedSection.jsx";
import EmagSection from "./page/EmagSection.jsx";
import GallerySection from "./page/GallerySection.jsx";

export default async function Page() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="border-b border-border-primary bg-background-secondary/50 px-[5%] py-3 md:py-4">
            <div className="mx-auto max-w-3xl">
              <LoadingGrid columns={3} rows={1} height="3.5rem" />
            </div>
          </div>
        }
      >
        <EventsSection />
      </Suspense>
      <Header30 />
      <Suspense
        fallback={
          <div className="px-[5%] py-16 md:py-24 lg:py-28">
            <LoadingGrid />
          </div>
        }
      >
        <OpedSection />
      </Suspense>
      <Suspense
        fallback={
          <div className="px-[5%] py-16 md:py-24 lg:py-28">
            <LoadingGrid />
          </div>
        }
      >
        <EmagSection />
      </Suspense>
      <Suspense
        fallback={
          <div className="px-[5%] py-16 md:py-24 lg:py-28">
            <LoadingGrid />
          </div>
        }
      >
        <GallerySection />
      </Suspense>
      <Cta27 />
      <Cta32 />
    </div>
  );
}
