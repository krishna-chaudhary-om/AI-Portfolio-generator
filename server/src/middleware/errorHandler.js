import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, _next) {
  err.statusCode = err.statusCode || err.status || 500;
  err.status = err.statusCode >= 500 ? 'error' : 'fail';

  // Log server errors
  if (err.statusCode >= 500) {
    logger.error(`${err.statusCode} ${req.method} ${req.url} — ${err.message}`, {
      stack: err.stack,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      status: 'fail',
      message: `${field} is already in use`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ status: 'fail', message: messages.join(', ') });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'fail', message: 'Token expired. Please log in again.' });
  }

  // Generic response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
