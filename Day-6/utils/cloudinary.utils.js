import cloudinary from '../Config/cloudinary.config.js'
import fs from 'fs'

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'shopzen/avatars',
    })
    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath)
    console.error('Cloudinary upload error:', error)
    return null
  }
}

export { uploadOnCloudinary }
