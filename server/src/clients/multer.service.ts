import multer from "multer";

const storage = multer.memoryStorage();

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const upload = multer({ storage });

// Used for routes that accept a single image
export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
});

export default upload;
