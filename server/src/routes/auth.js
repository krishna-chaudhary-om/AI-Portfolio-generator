import { Router } from 'express';
import { register, login, getMe, updateMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { registerRules, loginRules, validate } from '../middleware/validate.js';

const router = Router();

router.post('/register', authRateLimiter, registerRules, validate, register);
router.post('/login',    authRateLimiter, loginRules,    validate, login);
router.get('/me',        protect, getMe);
router.patch('/me',      protect, updateMe);

export default router;
