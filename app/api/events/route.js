import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { isEditorOrAdmin } from '@/lib/auth'

// GET - List all events
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const upcoming = searchParams.get('upcoming') === 'true'

    const where = {}
    if (upcoming) {
      where.date = {
        gte: new Date(),
      }
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: {
          date: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST - Create new event
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
        { error: 'Forbidden: Only editors and admins can create events' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, imageUrl, date, time, location } = body

    if (!title || !description || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, date, time' },
        { status: 400 }
      )
    }

    // Validate date/time
    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Optional: basic future check (date only; time is stored separately)
    const today = new Date()
    const dateOnly = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate()
    )
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
    if (dateOnly < todayOnly) {
      return NextResponse.json(
        { error: 'Date must be today or in the future' },
        { status: 400 }
      )
    }

    if (location !== undefined && typeof location !== 'string') {
      return NextResponse.json(
        { error: 'Location must be a string' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        date: parsedDate,
        time,
        location,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
