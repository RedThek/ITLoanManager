import express from 'express';
import { register, login, logout, reset } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimitMiddleware.js';
import { validateLogin } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', authenticateToken, logout);
router.post('/reset', authenticateToken, authLimiter, reset);

export default router;