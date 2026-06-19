import express from 'express';
import { createLoanRequest, updateLoanStatus, getAllLoans, getPendingLoansCount } from '../controllers/loanController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route sécurisée : seul un utilisateur authentifié peut soumettre un prêt
router.post('/', authenticateToken, createLoanRequest);
router.get('/', authenticateToken, getAllLoans);
router.get('/pending-count', authenticateToken, getPendingLoansCount);
router.patch('/:id/status', authenticateToken, requireRole('ADMIN'), updateLoanStatus);

export default router;