import { Loan } from '../models/Loan.js';
import { NotificationService } from './NotificationService.js';
import { LoanPolicy } from '../config/loanPolicy.js';
import { LoanStatus } from '../config/constants.js';

// Principe D (Dependency Inversion) : dépend de l'abstraction NotificationService,
// pas d'un système de notification concret (email, SMS, etc.)
export const LoanMonitoringService = {

    // Analyse tous les prêts actifs et déclenche les alertes appropriées
    async checkAndNotifyOverdueLoans() {
        const now = Date.now();

        // On ne cherche que les prêts actuellement approuvés
        const activeLoans = await Loan.find({ status: LoanStatus.APPROVED })
            .populate('equipmentId');

        let warningsCreated = 0;
        let remindersCreated = 0;

        for (const loan of activeLoans) {
            const loanAgeMs = now - loan.requestDate.getTime();

            if (loanAgeMs >= LoanPolicy.MAX_LOAN_DURATION_MS) {
                // Emprunt dépassé : alerte de retard
                const notification = await NotificationService.createOverdueWarning(loan);
                if (notification) warningsCreated++;

            } else if (loanAgeMs >= LoanPolicy.WARNING_THRESHOLD_MS) {
                // Approche de l'échéance : rappel préventif
                const notification = await NotificationService.createReturnReminder(loan);
                if (notification) remindersCreated++;
            }
        }

        return {
            checked: activeLoans.length,
            warningsCreated,
            remindersCreated,
        };
    },

    // Retourne les prêts en retard avec leurs détails — pour la vue admin
    async getOverdueLoans() {
        const overdueThreshold = new Date(Date.now() - LoanPolicy.MAX_LOAN_DURATION_MS);

        return await Loan.find({
            status: LoanStatus.APPROVED,
            requestDate: { $lt: overdueThreshold },
        })
            .populate('equipmentId')
            .sort({ requestDate: 1 }); // Plus ancien en premier
    },

    // Calcule le nombre de jours depuis le début d'un emprunt
    calculateDaysElapsed(loan) {
        const ms = Date.now() - loan.requestDate.getTime();
        return Math.floor(ms / (24 * 60 * 60 * 1000));
    },
};