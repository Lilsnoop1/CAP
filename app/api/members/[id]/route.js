import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isEditorOrAdmin } from "@/lib/auth";

// GET - Get single member by ID
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

// PUT - Update member
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isEditorOrAdmin(user)) {
      return NextResponse.json(
        { error: "Forbidden: Only editors and admins can update members" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const { id } = resolvedParams || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, role, bio, profileImageUrl } = body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImageUrl !== undefined) updateData.profileImageUrl = profileImageUrl;

    const updatedMember = await prisma.member.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// DELETE - Delete member
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isEditorOrAdmin(user)) {
      return NextResponse.json(
        { error: "Forbidden: Only editors and admins can delete members" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const { id } = resolvedParams || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
