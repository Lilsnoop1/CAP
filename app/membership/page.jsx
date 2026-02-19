"use server";

import React from "react";
import Header69 from "../components/Header69.jsx";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

async function fetchMembers() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/members`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.members || data || [];
}

export default async function MembershipPage() {
  const members = await fetchMembers();

  return (
    <div>
      <Header69
        imageUrl="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2100&h=900&q=80"
        title="Our Members"
        subtitle="Meet the people behind the Center of Alternative Perspectives."
      />
      <section className="px-[5%] py-12 md:py-16 lg:py-20 bg-background-secondary">
        <div className="container">
          <div className="mb-10 flex flex-col gap-2 text-left">
            <p className="text-sm font-semibold text-muted-foreground">
              Team
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">Membership</h1>
            <p className="text-muted-foreground md:text-md">
              A collective of editors, researchers, and strategists.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {members.map((m, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col items-center gap-6 rounded-2xl border border-border-primary bg-background-primary/90 p-6 shadow-sm md:gap-10 md:p-8 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="w-full md:w-2/5">
                    <img
                      src={
                        m.profileImageUrl ||
                        "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                      }
                      alt={m.name}
                      className="w-full max-h-72 rounded-xl object-cover"
                    />
                  </div>
                  <div className="w-full md:w-3/5 space-y-3 text-left">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold uppercase text-muted-foreground">
                        {m.role || "Member"}
                      </p>
                      <h3 className="text-2xl font-bold text-foreground">{m.name}</h3>
                    </div>
                    {m.bio && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {m.bio}
                      </p>
                    )}
                    {!m.bio && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Bio coming soon.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {members.length === 0 && (
              <p className="text-sm text-muted-foreground">No members yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

