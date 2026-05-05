import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import { extractTextFromResume } from './resumeParser.js';
import { generatePortfolioContent } from './openaiService.js';
import { logger } from '../utils/logger.js';

/**
 * Process an uploaded resume: parse → generate → save.
 * Sets generationStatus to 'processing' immediately so the client
 * can poll, then resolves with the completed portfolio.
 */
export async function processResume({ buffer, mimetype, userId, options }) {
  // 1. Create a pending portfolio record
  const portfolio = await Portfolio.create({
    owner: userId,
    theme: options.theme || 'professional',
    layout: options.layout || 'single-page',
    tone: options.tone || 'professional',
    generationStatus: 'processing',
  });

  try {
    // 2. Parse resume text
    const rawText = await extractTextFromResume(buffer, mimetype);
    portfolio.rawText = rawText;

    // 3. Generate portfolio content via OpenAI
    const content = await generatePortfolioContent(rawText, options);
    portfolio.content = content;

    // Derive title from name
    if (content?.hero?.name) {
      portfolio.title = `${content.hero.name}'s Portfolio`;
    }

    portfolio.generationStatus = 'complete';
    await portfolio.save();

    // Increment user portfolio count
    await User.findByIdAndUpdate(userId, { $inc: { portfolioCount: 1 } });

    logger.info(`Portfolio ${portfolio._id} generated successfully`);
    return portfolio;

  } catch (err) {
    logger.error(`Portfolio ${portfolio._id} generation failed:`, err);
    portfolio.generationStatus = 'failed';
    portfolio.generationError = err.message;
    await portfolio.save();
    throw err;
  }
}

/**
 * Get all portfolios for a user (paginated).
 */
export async function getUserPortfolios(userId, { page = 1, limit = 10 } = {}) {
  const skip = (page - 1) * limit;
  const [portfolios, total] = await Promise.all([
    Portfolio.find({ owner: userId })
      .select('-rawText -content.experience -content.projects')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Portfolio.countDocuments({ owner: userId }),
  ]);

  return {
    portfolios,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

/**
 * Get a single portfolio (owner or public).
 */
export async function getPortfolio(portfolioId, userId) {
  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio) throw Object.assign(new Error('Portfolio not found'), { status: 404 });

  const isOwner = portfolio.owner.toString() === userId?.toString();
  if (!isOwner && !portfolio.isPublic) {
    throw Object.assign(new Error('Portfolio not found'), { status: 404 });
  }

  if (!isOwner) {
    await Portfolio.findByIdAndUpdate(portfolioId, { $inc: { views: 1 } });
  }

  return portfolio;
}

/**
 * Get portfolio by public shareId (no auth required).
 */
export async function getPublicPortfolio(shareId) {
  const portfolio = await Portfolio.findOne({ shareId, isPublic: true });
  if (!portfolio) throw Object.assign(new Error('Portfolio not found'), { status: 404 });
  await Portfolio.findByIdAndUpdate(portfolio._id, { $inc: { views: 1 } });
  return portfolio;
}

/**
 * Update portfolio content / settings.
 */
export async function updatePortfolio(portfolioId, userId, updates) {
  const portfolio = await Portfolio.findOne({ _id: portfolioId, owner: userId });
  if (!portfolio) throw Object.assign(new Error('Portfolio not found'), { status: 404 });

  const allowedFields = ['title', 'theme', 'layout', 'tone', 'content', 'isPublic'];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      portfolio[field] = updates[field];
    }
  }

  if (updates.isPublic && !portfolio.publishedAt) {
    portfolio.publishedAt = new Date();
  }

  await portfolio.save();
  return portfolio;
}

/**
 * Delete a portfolio.
 */
export async function deletePortfolio(portfolioId, userId) {
  const portfolio = await Portfolio.findOneAndDelete({ _id: portfolioId, owner: userId });
  if (!portfolio) throw Object.assign(new Error('Portfolio not found'), { status: 404 });
  await User.findByIdAndUpdate(userId, { $inc: { portfolioCount: -1 } });
  return { deleted: true };
}
