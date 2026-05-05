import { processResume } from '../services/portfolioService.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const uploadResume = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  const { theme, layout, tone } = req.body;

  const portfolio = await processResume({
    buffer: req.file.buffer,
    mimetype: req.file.mimetype,
    userId: req.user._id,
    options: { theme, layout, tone },
  });

  res.status(201).json({
    status: 'success',
    portfolio,
  });
});
