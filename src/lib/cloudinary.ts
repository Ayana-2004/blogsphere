export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'blogsphere_uploads')
  formData.append('cloud_name', 'dkkf4schl')

  const response = await fetch(`https://api.cloudinary.com/v1_1/dkkf4schl/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Image upload failed')
  }

  const data = await response.json()
  return data.secure_url
}
