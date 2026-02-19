import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { isEditorOrAdmin, isAdmin } from '@/lib/auth'

const CONTENT_TYPES = ['OPED', 'ANNOUNCEMENT', 'VIDEO', 'GALLERY', 'EMAGAZINE']
const CONTENT_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED']

// GET - List all content with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = {}
    if (type && CONTENT_TYPES.includes(type)) {
      where.type = type
    }
    if (status && CONTENT_STATUSES.includes(status)) {
      where.status = status
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          media: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ])

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// POST - Create new content
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
        { error: 'Forbidden: Only editors and admins can create content' },
        { status: 403 }
      )
    }

    const payload = await request.json()
    const { type, title, slug, body, status, publishedAt } = payload

    if (!type || !title || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, slug' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingContent = await prisma.content.findUnique({
      where: { slug },
    })

    if (existingContent) {
      return NextResponse.json(
        { error: 'Content with this slug already exists' },
        { status: 409 }
      )
    }

    const content = await prisma.content.create({
      data: {
        type,
        title,
        slug,
        body,
        status: status || 'DRAFT',
        authorId: user.id,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
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

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}
