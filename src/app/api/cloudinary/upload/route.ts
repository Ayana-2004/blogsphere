import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const cloudinaryForm = new FormData()
    cloudinaryForm.append('file', file)
    cloudinaryForm.append('upload_preset', 'blogsphere_uploads')

    const res = await fetch('https://api.cloudinary.com/v1_1/dkkf4schl/image/upload', {
      method: 'POST',
      body: cloudinaryForm,
    })

    const data = await res.json()
    return NextResponse.json({ success: true, url: data.secure_url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
