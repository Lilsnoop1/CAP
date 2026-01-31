"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email?.toLowerCase();
    const email = (data?.email || sessionEmail || "").trim().toLowerCase();
    const source = data?.source || null;

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const subscription = await prisma.subscription.upsert({
      where: { email },
      update: { source },
      create: { email, source },
    });

    return NextResponse.json({ ok: true, subscription });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json().catch(() => ({}));
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email?.toLowerCase();
    const role = session?.user?.role;
    const isPrivileged = role === "ADMIN" || role === "EDITOR";

    const email = (data?.email || sessionEmail || "").trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    if (!isPrivileged && sessionEmail && email !== sessionEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.subscription.delete({ where: { email } }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "Failed to unsubscribe." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const email = session?.user?.email?.toLowerCase();
    const isPrivileged = role === "ADMIN" || role === "EDITOR";

    if (isPrivileged) {
      const subscriptions = await prisma.subscription.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ subscriptions });
    }

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sub = await prisma.subscription.findUnique({ where: { email } });
    return NextResponse.json({ subscriptions: sub ? [sub] : [] });
  } catch (error) {
    console.error("Fetch subscriptions error:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions." }, { status: 500 });
  }
}
