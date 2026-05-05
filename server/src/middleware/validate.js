import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

// Run validation and surface errors
export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map(e => e.msg).join(', ');
    return next(new AppError(msg, 400));
  }
  next();
}

// ── Validation rule sets ────────────────────────────────────────────────────
export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const portfolioUpdateRules = [
  body('theme').optional().isIn(['professional', 'creative', 'minimal', 'dark', 'vibrant']),
  body('layout').optional().isIn(['single-page', 'multi-section', 'card-grid']),
  body('tone').optional().isIn(['professional', 'casual', 'bold']),
  body('isPublic').optional().isBoolean(),
];
