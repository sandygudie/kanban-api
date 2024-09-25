const ImageKit = require('imagekit')
const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = require('../config')
const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT
})

// eslint-disable-next-line import/prefer-default-export
const imagekitUploadImage = async ({ file, fileName, folder }) => {
  let uploadUrl
  const fileBufferString = file
  try {
    // Purge cache First
    imagekit.purgeCache(`${IMAGEKIT_URL_ENDPOINT}/${folder}/${fileName}`)

    // Upload image to imagekit
    const response = await imagekit.upload({
      file: fileBufferString,
      fileName,
      folder,
      useUniqueFileName: false
    })
    uploadUrl = response.url
  } catch (error) {
    throw new Error(error)
  }
  return uploadUrl
}

module.exports = { imagekitUploadImage }
