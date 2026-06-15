import mongoose from '../config/db.js';
import Loan from '../models/Loan.js';
import Equipment from '../models/Equipment.js';

// POST /api/loans -> Un étudiant soumet une réservation
export const createLoanRequest = async (req, res) => {
    const { studentId, equipmentId } = req.body;
    try {
        const targetEquipment = await Equipment.findById(equipmentId);
        if (!targetEquipment || targetEquipment.status !== 'En stock') {
            return res.status(400).json({ error: "Opération impossible. L'équipement est indisponible." });
        }

        const loanRequest = await Loan.create({ studentId, equipmentId });
        return res.status(201).json(loanRequest);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// PATCH /api/loans/:id/status -> Logique transactionnelle de validation d'état
export const updateLoanStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'Approuve', 'Refuse' ou 'Termine'

    try {
        const currentLoan = await Loan.findById(id);
        if (!currentLoan) return res.status(404).json({ error: "Demande de prêt introuvable." });

        currentLoan.status = status;
        await currentLoan.save();

        // Application stricte de la logique de synchronisation d'état exigée
        if (status === 'Approuve') {
            await Equipment.findByIdAndUpdate(currentLoan.equipmentId, { status: 'Emprunte' });
        } else if (status === 'Termine') {
            await Equipment.findByIdAndUpdate(currentLoan.equipmentId, { status: 'En stock' });
        }

        return res.json({ message: "Le statut de la transaction a été révisé avec succès.", loan: currentLoan });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getPendingLoansCount = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Privilèges insuffisants.' });

        const count = await Loan.countDocuments({ status: LoanStatus.PENDING });
        return res.json({ pendingCount: count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const processLoanDecision = async (req, res) => {
    try {
        const { loanId } = req.params;
        const { action } = req.body;

        if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Action non autorisée.' });
        if (![LoanStatus.APPROVED, LoanStatus.REJECTED].includes(action)) {
            return res.status(400).json({ error: 'Décision administrative invalide.' });
        }

        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ error: 'Dossier d\'emprunt introuvable.' });
        if (loan.status !== LoanStatus.PENDING) return res.status(400).json({ error: 'Ce dossier a déjà fait l\'objet d\'un arbitrage.' });

        const nextEquipmentStatus = action === LoanStatus.APPROVED ? EquipmentStatus.BORROWED : EquipmentStatus.IN_STOCK;

        const session = await mongoose.startSession();
        let updatedLoan;
        await session.withTransaction(async () => {
            updatedLoan = await Loan.findByIdAndUpdate(
                loan._id,
                { status: action, actionDate: new Date() },
                { new: true, session }
            );

            await Equipment.findByIdAndUpdate(
                loan.equipmentId,
                { status: nextEquipmentStatus },
                { session }
            );
        });
        session.endSession();

        return res.json({ message: `Dossier traité avec succès : statut mis à jour à [${action}].`, loan: updatedLoan });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/loans -> L'administrateur liste toutes les demandes formulées
export const getAllLoans = async (req, res) => {
    try {
        // APPLICATION STRICTE DE EXIGENCE CAHIER DES CHARGES : populate()
        const loans = await Loan.find().populate('equipmentId');
        return res.json(loans);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};