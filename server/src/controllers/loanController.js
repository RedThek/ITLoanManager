import { sqlitePrisma } from '../config/db.js';
import { EquipmentStatus, LoanStatus } from '../config/constants.js';


// 1. L'Étudiant crée une demande (POST /api/loans)
export const createLoanRequest = async (req, res) => {
    try {
        const { equipmentId, studentMatricule } = req.body;
        const studentId = req.user.id; // Récupérer l'ID de l'étudiant à partir du token JWT

        // Validation du matériel ciblé
        const equipment = await sqlitePrisma.equipment.findUnique({ where: { id: parseInt(equipmentId) } });
        if (!equipment) return res.status(404).json({ error: "Équipement introuvable au catalogue." });
        
        // Sécurité réglementaire : Vérifier si le matériel est disponible
        if (equipment.status !== EquipmentStatus.IN_STOCK) {
            return res.status(400).json({ error: "Cet équipement n'est pas disponible pour le moment." });
        }

        // Création du prêt au statut 'En attente'
        const newLoan = await sqlitePrisma.loan.create({
            data: {
                studentId: studentId, // [cite: 14, 31]
                equipmentId: parseInt(equipmentId),   // [cite: 32]
                status: LoanStatus.PENDING  // [cite: 34]
            },
            include: { equipment: true }
        });

        return res.status(201).json({ message: "Votre demande d'emprunt a été soumise avec succès.", loan: newLoan });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 2. L'Admin modifie le statut (PATCH /api/loans/:id/status)
export const updateLoanStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { targetStatus } = req.body; // ex: 'Approuve' ou 'Termine'

        if (!Object.values(LoanStatus).includes(targetStatus)) {
            return res.status(400).json({ error: "Statut cible invalide." });
        }

        const loan = await sqlitePrisma.loan.findUnique({ where: { id } });
        if (!loan) return res.status(404).json({ error: "Demande de prêt introuvable." });

        let equipmentTargetStatus = null;

        if (targetStatus === LoanStatus.APPROVED) {
            equipmentTargetStatus = EquipmentStatus.BORROWED; // [cite: 67]
        } else if (targetStatus === LoanStatus.FINISHED) {
            equipmentTargetStatus = EquipmentStatus.IN_STOCK; // [cite: 68]
        }

        // Bloc Transactionnel Prisma ACIDE
        const result = await sqlitePrisma.$transaction(async (tx) => {
            // Action 1 : Mettre à jour le statut du prêt
            const updatedLoan = await tx.loan.update({
                where: { id },
                data: { status: targetStatus } // [cite: 66]
            });

            // Action 2 : Mettre à jour l'équipement lié si nécessaire
            if (equipmentTargetStatus) {
                await tx.equipment.update({
                    where: { id: loan.equipmentId },
                    data: { status: equipmentTargetStatus } // [cite: 67, 68]
                });
            }

            return updatedLoan;
        });

        return res.json({ message: "Statut mis à jour avec succès transactionnel.", result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Renvoie le nombre de dossiers urgents en attente de validation
export const getPendingLoansCount = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') return res.status(403).json({ error: "Privilèges insuffisants." });
        
        const count = await sqlitePrisma.loan.count({
            where: { status: LoanStatus.PENDING }
        });
        return res.json({ pendingCount: count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const processLoanDecision = async (req, res) => {
    try {
        const { loanId } = req.params;
        const { action } = req.body; // Attendu: 'Approuve' ou 'Refuse'
        
        if (req.user.role !== 'ADMIN') return res.status(403).json({ error: "Action non autorisée." });

        if (![LoanStatus.APPROVED, LoanStatus.REJECTED].includes(action)) {
            return res.status(400).json({ error: "Décision administrative invalide." });
        }

        const loan = await sqlitePrisma.loan.findUnique({ where: { id: parseInt(loanId) } });
        if (!loan) return res.status(404).json({ error: "Dossier d'emprunt introuvable." });
        if (loan.status !== LoanStatus.PENDING) return res.status(400).json({ error: "Ce dossier a déjà fait l'objet d'un arbitrage." });

        // Détermination de l'état cible de l'équipement
        const nextEquipmentStatus = (action === LoanStatus.APPROVED) ? EquipmentStatus.BORROWED : EquipmentStatus.IN_STOCK;

        // BLOC TRANSACTIONNEL UNIQUE : Tout s'exécute ou tout s'annule
        const transactionResult = await sqlitePrisma.$transaction(async (tx) => {
            const updatedLoan = await tx.loan.update({
                where: { id: parseInt(loanId) },
                data: { status: action, actionDate: new Date() }
            });

            await tx.equipment.update({
                where: { id: loan.equipmentId },
                data: { status: nextEquipmentStatus }
            });

            return updatedLoan;
        });

        return res.json({ message: `Dossier traité avec succès : statut mis à jour à [${action}].`, loan: transactionResult });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllLoans = async (req, res) => {
    try {
        const loans = await sqlitePrisma.loan.findMany({
            include: { equipment: true },
            orderBy: { requestDate: 'desc' }
        });
        return res.json(loans);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};