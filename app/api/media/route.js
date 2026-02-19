import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { isEditorOrAdmin } from '@/lib/auth'

const MEDIA_TYPES = ['IMAGE', 'VIDEO', 'PDF', 'YOUTUBE']

// GET - List all media with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const contentId = searchParams.get('contentId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = {}
    if (type && MEDIA_TYPES.includes(type)) {
      where.type = type
    }
    if (contentId) {
      where.contentId = contentId
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        include: {
          content: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ])

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

// POST - Create new media
export async function POST(request) {
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
        { error: 'Forbidden: Only editors and admins can create media' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { type, url, mimeType, size, contentId } = body

    if (!type || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: type, url' },
        { status: 400 }
      )
    }

    if (type === 'YOUTUBE' && contentId) {
      return NextResponse.json(
        { error: 'YouTube media must not be linked to content' },
        { status: 400 }
      )
    }

    // If contentId is provided, verify content exists
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

    const media = await prisma.media.create({
      data: {
        type,
        url,
        mimeType,
        size,
        contentId: contentId || null,
      },
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

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error creating media:', error)
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    )
  }
}
