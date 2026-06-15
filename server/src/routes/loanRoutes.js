import express from 'express';
import { createLoanRequest, updateLoanStatus, getAllLoans, getPendingLoansCount } from '../controllers/loanController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route sécurisée : seul un utilisateur authentifié peut soumettre un prêt
router.post('/loans', authenticateToken, createLoanRequest);
router.get('/loans', authenticateToken, getAllLoans);
router.get('/loans/pending-count', authenticateToken, getPendingLoansCount);
router.patch('/loans/:id/status', authenticateToken, updateLoanStatus);

export default router;