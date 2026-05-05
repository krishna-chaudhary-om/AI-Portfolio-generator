import { Router } from 'express';
import {
  listPortfolios,
  getOne,
  getPublic,
  update,
  remove,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';
import { portfolioUpdateRules, validate } from '../middleware/validate.js';

const router = Router();

// Public route — share link
router.get('/share/:shareId', getPublic);

// All routes below require auth
router.use(protect);

router.get('/',    listPortfolios);
router.get('/:id', getOne);
router.patch('/:id', portfolioUpdateRules, validate, update);
router.delete('/:id', remove);

export default router;
