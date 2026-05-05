import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/database.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });

    // 🚨 Handle port already in use
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Trying ${PORT + 1}...`);

        app.listen(PORT + 1, () => {
          logger.info(`Server running on port ${PORT + 1}`);
        });
      } else {
        logger.error('Server error:', err);
        process.exit(1);
      }
    });

  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();