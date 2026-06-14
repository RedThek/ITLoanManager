import { PrismaClient } from '@prisma/client';
import { EquipmentStatus, LoanStatus } from '../config/constants.js';

const prisma = new PrismaClient();

// 1. L'Étudiant crée une demande (POST /api/loans)
export const createLoanRequest = async (req, res) => {
    try {
        const { equipmentId, studentMatricule } = req.body; // [cite: 14]

        // Validation du matériel ciblé
        const equipment = await prisma.equipment.findUnique({ where: { id: equipmentId } });
        if (!equipment) return res.status(404).json({ error: "Équipement introuvable." });
        
        // Sécurité réglementaire : Vérifier si le matériel est disponible
        if (equipment.status !== EquipmentStatus.IN_STOCK) { // [cite: 60]
            return res.status(400).json({ error: "Cet équipement n'est pas disponible pour le moment." });
        }

        // Création du prêt au statut 'En attente'
        const newLoan = await prisma.loan.create({
            data: {
                studentId: studentMatricule, // [cite: 14, 31]
                equipmentId: equipmentId,   // [cite: 32]
                status: LoanStatus.PENDING  // [cite: 34]
            }
        });

        return res.status(201).json(newLoan);
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

        const loan = await prisma.loan.findUnique({ where: { id } });
        if (!loan) return res.status(404).json({ error: "Demande de prêt introuvable." });

        let equipmentTargetStatus = null;

        if (targetStatus === LoanStatus.APPROVED) {
            equipmentTargetStatus = EquipmentStatus.BORROWED; // [cite: 67]
        } else if (targetStatus === LoanStatus.FINISHED) {
            equipmentTargetStatus = EquipmentStatus.IN_STOCK; // [cite: 68]
        }

        // Bloc Transactionnel Prisma ACIDE
        const result = await prisma.$transaction(async (tx) => {
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