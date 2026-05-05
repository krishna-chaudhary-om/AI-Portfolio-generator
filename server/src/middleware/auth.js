import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  // Extract token
  let token;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    token = auth.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You must be logged in', 401));
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }

  // Check user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  req.user = user;
  next();
});
