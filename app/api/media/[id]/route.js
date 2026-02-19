import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { isEditorOrAdmin } from '@/lib/auth'

// GET - Get single media by ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

// PUT - Update media
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!isEditorOrAdmin(user)) {
      return NextResponse.json(
        { error: 'Forbidden: Only editors and admins can update media' },
        { status: 403 }
      )
    }

    const { id } = params
    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { type, url, mimeType, size, contentId } = body

    // If contentId is provided, verify content exists
    if (contentId !== undefined) {
      if (contentId) {
        const content = await prisma.content.findUnique({
          where: { id: contentId },
        })

        if (!content) {
          return NextResponse.json(
            { error: 'Content not found' },
            { status: 404 }
          )
        }
      }
    }

    const updateData = {}
    if (type !== undefined) updateData.type = type
    if (url !== undefined) updateData.url = url
    if (mimeType !== undefined) updateData.mimeType = mimeType
    if (size !== undefined) updateData.size = size
    if (contentId !== undefined) updateData.contentId = contentId || null

    if (updateData.type === 'YOUTUBE' && updateData.contentId) {
      return NextResponse.json(
        { error: 'YouTube media must not be linked to content' },
        { status: 400 }
      )
    }

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: updateData,
      include: {
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(updatedMedia)
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    )
  }
}

// DELETE - Delete media
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!isEditorOrAdmin(user)) {
      return NextResponse.json(
        { error: 'Forbidden: Only editors and admins can delete media' },
        { status: 403 }
      )
    }

    const { id } = params
    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    await prisma.media.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}
