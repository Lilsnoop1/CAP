import { NextResponse } from 'next/server'

const WORKER_URL = process.env.WORKER_UPLOAD_URL
const WORKER_TOKEN = process.env.R2_WORKER_SECRET

export async function POST(request) {
  if (!WORKER_URL || !WORKER_TOKEN) {
    return NextResponse.json(
      { error: 'R2 worker configuration missing' },
      { status: 500 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const prefix = formData.get('prefix') || 'uploads'

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const originalName = file.name || 'file'
    const safeName = originalName.replace(/\s+/g, '-')
    const key = `${prefix}/${Date.now()}-${safeName}`
    const contentType =
      file.type || 'application/octet-stream'

    const arrayBuffer = await file.arrayBuffer()

    const putRes = await fetch(`${WORKER_URL}/${key}`, {
      method: 'PUT',
      headers: {
        'content-type': contentType,
        authorization: `Bearer ${WORKER_TOKEN}`,
      },
      body: arrayBuffer,
    })

    if (!putRes.ok) {
      const text = await putRes.text()
      return NextResponse.json(
        { error: 'Upload failed', detail: text },
        { status: putRes.status }
      )
    }

    const publicUrl = `${WORKER_URL}/${key}`
    return NextResponse.json({ url: publicUrl, key })
  } catch (error) {
    console.error('R2 upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

