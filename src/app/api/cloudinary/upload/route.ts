import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { image } = body

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'blogsphere',
    })

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
