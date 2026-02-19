"use server";

import React from "react";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchEmags() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/content?type=EMAGAZINE`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.contents || [];
}

export default async function EmagContent() {
  const emagazines = await fetchEmags();
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-10 flex flex-col gap-3 md:mb-14">
          <h2 className="text-4xl font-bold md:text-5xl">Emagazines</h2>
          <p className="text-muted-foreground">
            Browse CAP emagazines. Click to open the PDF in a new tab.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {emagazines.map((item) => {
            const pdfUrl = item.media?.[0]?.url;
            return (
              <div
                key={item.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <a
                  href={pdfUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6 group-hover:from-red-100 group-hover:to-red-200 transition-colors duration-300">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-16 h-16 text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.878a2.25 2.25 0 00-.659-1.591l-4.622-4.622a2.25 2.25 0 00-1.59-.659H6.75A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h10.5a2.25 2.25 0 002.25-2.25v-1.5"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.25 6.75v3a.75.75 0 00.75.75h3"
                        />
                      </svg>
                      <div className="w-20 h-1 bg-red-300 rounded-full mx-auto group-hover:w-24 transition-all duration-300" />
                    </div>
                  </div>
                </a>

                <div className="p-6">
                  <div className="mb-3">
                    <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                      PDF Magazine
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">
                    {item.title}
                  </h3>

                  {item.slug && (
                    <p className="text-sm text-gray-500 mb-4">Issue: {item.slug}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      PDF Document
                    </span>
                    <a
                      href={pdfUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200 group"
                    >
                      View PDF
                      <span className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
          {emagazines.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No emagazines found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

