import { Loan } from '../models/index.js';
import { LoanStatus } from '../config/constants.js';
import { LoanService } from '../services/loanService.js';

// POST /api/loans -> L'étudiant connecté crée une demande
export const createLoanRequest = async (req, res) => {

    try {
        const result = await LoanService.createLoan(req.user.matricule, req.body.equipmentId);

        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// PATCH /api/loans/:id/status -> L'admin valide/refuse/clôture
export const updateLoanStatus = async (req, res) => {

    try {

        const result = await LoanService.changeStatus(req.params.id, req.body.status);
        return res.json({ message: "Statut mis à jour avec succès.", loan: result });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// GET /api/loans -> admin voit tout, étudiant voit ses propres demandes
export const getAllLoans = async (req, res) => {
    try {
        const filter = req.user.role === 'ADMIN' ? {} : { studentId: req.user.matricule };
        const loans = await Loan.find(filter).populate('equipmentId');
        return res.json(loans);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const getPendingLoansCount = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') return res.status(403).json({ error: "Privilèges insuffisants." });
        const count = await Loan.countDocuments({ status: LoanStatus.PENDING });
        return res.json({ pendingCount: count });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};