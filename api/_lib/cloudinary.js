const { v2: cloudinary } = require('cloudinary');

let configured = false;

function getCloudinary() {
  if (!configured) {
    // Acepta las 3 variables sueltas o CLOUDINARY_URL (el SDK la lee sola)
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
      });
    }
    configured = true;
  }
  return cloudinary;
}

function cloudinaryConfigurado() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL);
}

/** Sube un buffer de imagen y devuelve { secure_url, public_id } */
function subirImagen(buffer) {
  const cl = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cl.uploader.upload_stream(
      {
        folder: 'memorias-rpu',
        resource_type: 'image',
        // Cloudinary optimiza y sirve por su CDN automáticamente
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

/** Borra una imagen por su public_id */
function borrarImagen(publicId) {
  return getCloudinary().uploader.destroy(publicId, { resource_type: 'image' });
}

module.exports = { subirImagen, borrarImagen, cloudinaryConfigurado };
