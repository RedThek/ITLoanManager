import express from 'express';
import rateLimit from 'express-rate-limit';
import { createLoanRequest, updateLoanStatus, getAllLoans, getPendingLoansCount } from '../controllers/loanController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

const statusUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 status update requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// Route sécurisée : seul un utilisateur authentifié peut soumettre un prêt
router.post('/', authenticateToken, createLoanRequest);
router.get('/', authenticateToken, getAllLoans);
router.get('/pending-count', authenticateToken, getPendingLoansCount);
router.patch('/:id/status', statusUpdateLimiter, authenticateToken, requireRole('ADMIN'), updateLoanStatus);

export default router;