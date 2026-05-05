import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const ALLOWED_MIMES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);

const storage = multer.memoryStorage(); // keep in memory — no disk writes

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF and DOCX files are accepted', 415), false);
  }
}

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
}).single('resume');

// Wrap multer to surface errors via express error handler
export function handleUpload(req, res, next) {
  uploadMiddleware(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError(`File too large. Max size: ${MAX_SIZE_MB}MB`, 413));
    }
    next(err);
  });
}
