import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sendAuthResponse(user, statusCode, res) {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
}

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return next(new AppError('Email already registered', 409));

  const user = await User.create({ name, email, password });
  sendAuthResponse(user, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  sendAuthResponse(user, 200, res);
});

export const getMe = catchAsync(async (req, res) => {
  res.json({ status: 'success', user: req.user });
});

export const updateMe = catchAsync(async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  );
  res.json({ status: 'success', user });
});
