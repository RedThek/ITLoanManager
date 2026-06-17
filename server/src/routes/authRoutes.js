import express from 'express';
import { register, login, logout, reset } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', authLimiter, login);
router.post('/logout', authenticateToken, logout);
router.post('/reset', reset);

export default router;