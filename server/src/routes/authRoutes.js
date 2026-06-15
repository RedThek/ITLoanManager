import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateToken, register);
router.post('/login', authenticateToken, login);
router.post('/logout', authenticateToken, logout);


export default router;