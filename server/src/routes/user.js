import { Router } from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const router = Router();
router.use(protect);

// Delete account
router.delete('/me', catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError('User not found', 404));
  await user.deleteOne();
  res.status(204).send();
}));

export default router;
