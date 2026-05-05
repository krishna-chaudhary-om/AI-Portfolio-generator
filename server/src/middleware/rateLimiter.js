import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests. Please try again later.' },
});

// Stricter limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: 'error', message: 'Too many auth attempts. Try again in 15 minutes.' },
});

// Stricter limiter for AI generation (expensive)
export const generationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { status: 'error', message: 'Generation limit reached. Try again in an hour.' },
});
