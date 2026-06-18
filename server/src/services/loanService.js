import { Loan } from '../models/Loan.js';
import { Equipment } from '../models/Equipment.js';
import { LoanStatus, EquipmentStatus } from '../config/constants.js';
import { LoanPolicy } from '../config/loanPolicy.js';
import { NotificationService } from './notificationService.js';
import { NotificationType } from '../models/Notification.js';

export const LoanService = {
    async createLoan(studentId, equipmentId) {
        const equipment = await Equipment.findById(equipmentId);
        if (!equipment || equipment.status !== EquipmentStatus.IN_STOCK)
            throw new Error('Équipement indisponible.');
        return Loan.create({ studentId, equipmentId, status: LoanStatus.PENDING });
    },

    async changeStatus(loanId, newStatus) {
        if (!Object.values(LoanStatus).includes(newStatus))
            throw new Error('Statut invalide.');

        const loan = await Loan.findById(loanId);
        if (!loan) throw new Error('Prêt introuvable.');

        loan.status    = newStatus;
        loan.actionDate = new Date();

        const equipment = await Equipment.findById(loan.equipmentId);
        const equipName  = equipment?.name || 'matériel';

        if (newStatus === LoanStatus.APPROVED) {
            loan.dueDate = new Date(Date.now() + LoanPolicy.MAX_LOAN_DURATION_MS);
            await loan.save();
            await Equipment.findByIdAndUpdate(loan.equipmentId,
                { status: EquipmentStatus.BORROWED });
            await NotificationService.notifyStatusChange(
                loan, NotificationType.LOAN_APPROVED, equipName);

        } else if (newStatus === LoanStatus.FINISHED) {
            await loan.save();
            await Equipment.findByIdAndUpdate(loan.equipmentId,
                { status: EquipmentStatus.IN_STOCK });

        } else if (newStatus === LoanStatus.REJECTED) {
            await loan.save();
            await NotificationService.notifyStatusChange(
                loan, NotificationType.LOAN_REJECTED, equipName);
        } else {
            await loan.save();
        }
        return loan;
    },

    async getLoans(userRole, studentMatricule){
        const filter = userRole === 'ADMIN' ? {} : { studentId: studentMatricule };
        if (!userRole || !studentMatricule) {
            throw new Error('Informations indisponibles')
        }
        const loans = await Loan.find(filter).populate('equipmentId');
        return loans;
    },

    async countPendingLoans(userRole){
        //if (userRole !== 'ADMIN') return res.status(403).json({ error: "Privilèges insuffisants." });
        //const count = await Loan.countDocuments({ status: LoanStatus.PENDING });
        //return { pendingCount: count };
    }
};