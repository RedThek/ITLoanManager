import { Loan } from '../models/Loan.js';
import { Equipment } from '../models/Equipment.js';
import { LoanStatus, EquipmentStatus } from '../config/constants.js';
import { LoanPolicy } from '../config/loanPolicy.js';
import { NotificationService } from '../services/NotificationService.js';
import { NotificationType } from '../models/Notification.js';

// POST /api/loans -> L'étudiant connecté crée une demande
export const createLoanRequest = async (req, res) => {
    const { equipmentId } = req.body;
    const studentId = req.user.matricule; // identité tirée du JWT, pas du body

    if (req.user.role !== 'STUDENT' || !studentId) {
        return res.status(403).json({ error: "Seul un étudiant authentifié peut formuler une demande." });
    }

    try {
        const targetEquipment = await Equipment.findById(equipmentId);
        if (!targetEquipment || targetEquipment.status !== EquipmentStatus.IN_STOCK) {
            return res.status(400).json({ error: "Opération impossible. L'équipement est indisponible." });
        }

        const loanRequest = await Loan.create({ studentId, equipmentId, status: LoanStatus.PENDING });
        return res.status(201).json(loanRequest);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// PATCH /api/loans/:id/status -> L'admin valide/refuse/clôture
export const updateLoanStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(LoanStatus).includes(status)) {
        return res.status(400).json({ error: "Statut cible invalide." });
    }

    try {
        const currentLoan = await Loan.findById(id);
        if (!currentLoan) return res.status(404).json({ error: "Demande de prêt introuvable." });

        currentLoan.status = status;
        currentLoan.actionDate = new Date();

        // Calcul de la date d'échéance lors de l'approbation
        if (status === LoanStatus.APPROVED) {
            currentLoan.dueDate = new Date(Date.now() + LoanPolicy.MAX_LOAN_DURATION_MS);
            await currentLoan.save();
            await Equipment.findByIdAndUpdate(currentLoan.equipmentId, { status: EquipmentStatus.BORROWED });
            // Notification à l'étudiant
            const equip = await Equipment.findById(currentLoan.equipmentId);
            await NotificationService.notifyStatusChange(currentLoan, NotificationType.LOAN_APPROVED, equip?.name || 'matériel');

        } else if (status === LoanStatus.FINISHED) {
            await currentLoan.save();
            await Equipment.findByIdAndUpdate(currentLoan.equipmentId, { status: EquipmentStatus.IN_STOCK });

        } else if (status === LoanStatus.REJECTED) {
            await currentLoan.save();
            const equip = await Equipment.findById(currentLoan.equipmentId);
            await NotificationService.notifyStatusChange(currentLoan, NotificationType.LOAN_REJECTED, equip?.name || 'matériel');

        } else {
            await currentLoan.save();
        }

        return res.json({ message: "Statut mis à jour avec succès.", loan: currentLoan });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/loans -> admin voit tout, étudiant voit ses propres demandes
export const getAllLoans = async (req, res) => {
    try {
        const filter = req.user.role === 'ADMIN' ? {} : { studentId: req.user.matricule };
        const loans = await Loan.find(filter).populate('equipmentId');
        return res.json(loans);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getPendingLoansCount = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') return res.status(403).json({ error: "Privilèges insuffisants." });
        const count = await Loan.countDocuments({ status: LoanStatus.PENDING });
        return res.json({ pendingCount: count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};