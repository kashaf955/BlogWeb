const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const hasCloudinary =
  Boolean(process.env.CLOUDINARY_URL) ||
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

let storage;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'blogweb',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    },
  });
} else {
  const uploadDir = path.resolve('public', 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });

  storage = multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, uploadDir);
    },
    filename(_req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
}

const upload = multer({ storage });

function uploadCoverImage(req, res, next) {
  upload.single('coverImage')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).send(`Image upload failed: ${err.message}`);
    }
    return next();
  });
}

function getCoverImageURL(file) {
  if (!file) return null;
  if (hasCloudinary) {
    return file.path || file.secure_url || file.url || null;
  }
  return `/uploads/${file.filename}`;
}

module.exports = {
  uploadCoverImage,
  getCoverImageURL,
  usingCloudinary: hasCloudinary,
};
