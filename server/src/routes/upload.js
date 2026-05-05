import { Router } from 'express';
import { uploadResume } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { handleUpload } from '../middleware/upload.js';
import { generationRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/resume',
  // protect,        ← comment this out temporarily
  generationRateLimiter,
  handleUpload,
  uploadResume
);

export default router;
