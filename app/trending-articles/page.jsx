"use server";

import React from "react";
import Header69 from "../components/Header69.jsx";
import { Suspense } from "react";
import TrendingContent from "./TrendingContent.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";

export default async function Page() {
  return (
    <div>
      <Header69
        imageUrl="https://images.unsplash.com/photo-1494173853739-c21f58b16055?auto=format&fit=crop&w=2100&h=900&q=80"
        title="Trending Articles"
        subtitle="Latest OPED pieces from CAP contributors, updated regularly."
      />
      <Suspense fallback={<div className="px-[5%] py-16 md:py-24 lg:py-28"><LoadingGrid /></div>}>
        <TrendingContent />
      </Suspense>
    </div>
  );
}
