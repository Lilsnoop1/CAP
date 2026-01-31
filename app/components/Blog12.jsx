"use client";

import React from "react";
import { RxFileText, RxExternalLink } from "react-icons/rx";

export default function Blog12({ emagazines = [] }) {
  const items = emagazines.slice(0, 6);

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
      <div className="container max-w-7xl">
        <div className="mb-12 md:mb-16 lg:mb-20">
          <div className="mx-auto w-full max-w-2xl text-center">
            <p className="mb-3 font-semibold text-primary md:mb-4">Publications</p>
            <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-6xl lg:text-7xl">
              Latest Magazines
            </h1>
            <p className="text-lg text-muted-foreground">CAP's digital publications and research papers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((mag) => {
            const url = mag?.media?.[0]?.url;
            return (
              <div
                key={mag.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
                <a
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
            >
                  <div className="aspect-[4/3] bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6 group-hover:from-red-100 group-hover:to-red-200 transition-colors duration-300">
                    <div className="text-center">
                      <RxFileText className="w-16 h-16 text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <div className="w-20 h-1 bg-red-300 rounded-full mx-auto group-hover:w-24 transition-all duration-300"></div>
                </div>
                  </div>
                </a>

                <div className="p-6">
                  <div className="mb-3">
                    <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                      <RxFileText className="w-3 h-3 mr-1" />
                      PDF Magazine
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">
                    {mag.title}
                  </h3>

                  {mag.slug && (
                    <p className="text-sm text-gray-500 mb-4">
                      Issue: {mag.slug}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      PDF Document
                    </span>
                    <a
                      href={url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200 group"
                    >
                      View PDF
                      <RxExternalLink className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
                  </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <RxFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No magazines available.</p>
                </div>
        )}
      </div>
    </section>
  );
}


