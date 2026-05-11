import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const url = await uploadImageToCloudinary(file)
    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
