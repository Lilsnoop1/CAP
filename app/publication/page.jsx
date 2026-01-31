"use server";

import React, { Suspense } from "react";
import Header69 from "../components/Header69.jsx";
import Cta32 from "../components/Cta32.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmagContent from "./EmagContent.jsx";
import UpdatesContent from "./UpdatesContent.jsx";

export default async function Page() {
  return (
    <div>
      <Header69
        imageUrl="https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=2100&h=900&q=80"
        title="Publications & Magazines"
        subtitle="Browse CAP emagazines and publications, available as downloadable PDFs."
      />
      <Suspense fallback={<div className="px-[5%] py-16 md:py-24 lg:py-28"><LoadingGrid /></div>}>
        <EmagContent />
      </Suspense>
      <Suspense fallback={<div className="px-[5%] py-16 md:py-24 lg:py-28"><LoadingGrid /></div>}>
        <UpdatesContent />
      </Suspense>
      <Cta32 />
    </div>
  );
}
