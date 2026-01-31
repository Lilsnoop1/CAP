import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { canEditContent, isAdmin } from '@/lib/auth'

const CONTENT_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED']

// GET - Get single content by ID
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams || {}
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        media: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// PUT - Update content
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const { id } = resolvedParams || {}
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    const content = await prisma.content.findUnique({
      where: { id },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    if (!canEditContent(user, content)) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to edit this content' },
        { status: 403 }
      )
    }

    const payload = await request.json()
    const { type, title, slug, body, status, publishedAt } = payload

    // Check if slug is being changed and if it already exists
    if (slug && slug !== content.slug) {
      const existingContent = await prisma.content.findUnique({
        where: { slug },
      })

      if (existingContent) {
        return NextResponse.json(
          { error: 'Content with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const updateData = {}
    if (type !== undefined) updateData.type = type
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (body !== undefined) updateData.body = body
    if (status !== undefined) updateData.status = status
    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null
    }

    const updatedContent = await prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        media: true,
      },
    })

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

// DELETE - Delete content
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const { id } = resolvedParams || {}
    if (!id) {
      return NextResponse.json(
        { error: 'Missing content id' },
        { status: 400 }
      )
    }
    const content = await prisma.content.findUnique({
      where: { id },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Only admin or content author can delete
    if (!isAdmin(user) && content.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this content' },
        { status: 403 }
      )
    }

    await prisma.content.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}
