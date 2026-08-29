import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadReportImages = multer({
  storage: storage,
  limits: { files: 5 },
});

export default upload;
