import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'djknvzync',
  api_key: "569228811476594",
  api_secret: "di4UhIUKiZ1QnmpSQLdKU8I9Oko",
});

export const uploadToStorage = async (file) => {
  try {
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'checkins',
          resource_type: 'auto',
          transformation: {
            quality: 'auto:good',
            fetch_format: 'auto',
          },
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );

      const fs = require('fs');
      const readStream = fs.createReadStream(file.filepath);
      readStream.pipe(stream);
    });

    const imageUrl = await uploadPromise;
    return imageUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image');
  }
};