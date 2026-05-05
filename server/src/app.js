import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

import { globalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { logger } from './utils/logger.js';

import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import uploadRoutes from './routes/upload.js';
import userRoutes from './routes/user.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ── Security & utilities ────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('combined', { stream: { write: msg => logger.http(msg.trim()) } }));

// ── Rate limiting ───────────────────────────────────────────────────────────
app.use('/api/', globalRateLimiter);

// ── Static (serve built client in production) ───────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
}

// ── API routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/upload',     uploadRoutes);
app.use('/api/users',      userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── SPA fallback (production) ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// ── Error handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
