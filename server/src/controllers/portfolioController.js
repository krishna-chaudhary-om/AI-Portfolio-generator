import {
  getUserPortfolios,
  getPortfolio,
  getPublicPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '../services/portfolioService.js';
import { catchAsync } from '../utils/catchAsync.js';

export const listPortfolios = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await getUserPortfolios(req.user._id, { page, limit });
  res.json({ status: 'success', ...data });
});

export const getOne = catchAsync(async (req, res) => {
  const portfolio = await getPortfolio(req.params.id, req.user._id);
  res.json({ status: 'success', portfolio });
});

export const getPublic = catchAsync(async (req, res) => {
  const portfolio = await getPublicPortfolio(req.params.shareId);
  res.json({ status: 'success', portfolio });
});

export const update = catchAsync(async (req, res) => {
  const portfolio = await updatePortfolio(req.params.id, req.user._id, req.body);
  res.json({ status: 'success', portfolio });
});

export const remove = catchAsync(async (req, res) => {
  await deletePortfolio(req.params.id, req.user._id);
  res.status(204).send();
});
