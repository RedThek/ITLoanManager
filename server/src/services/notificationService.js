import { Notification, NotificationType } from '../models/Notification.js';

// Principe I (Interface Segregation) : méthodes courtes et ciblées
export const NotificationService = {

    // Crée une notification d'avertissement de retard
    async createOverdueWarning(loan) {
        const alreadyNotified = await Notification.findOne({
            loanId: loan._id,
            type: NotificationType.OVERDUE_WARNING,
        });

        // Idempotence : on n'envoie pas deux fois la même alerte pour le même prêt
        if (alreadyNotified) return null;

        return await Notification.create({
            studentMatricule: loan.studentId,
            loanId: loan._id,
            type: NotificationType.OVERDUE_WARNING,
            message: `Votre emprunt de "${loan.equipmentId?.name || 'matériel'}" dépasse la durée autorisée. Veuillez contacter le responsable du labo.`,
        });
    },

    // Crée une notification de rappel avant échéance
    async createReturnReminder(loan) {
        const alreadyReminded = await Notification.findOne({
            loanId: loan._id,
            type: NotificationType.RETURN_REMINDER,
        });

        if (alreadyReminded) return null;

        return await Notification.create({
            studentMatricule: loan.studentId,
            loanId: loan._id,
            type: NotificationType.RETURN_REMINDER,
            message: `Rappel : votre emprunt de "${loan.equipmentId?.name || 'matériel'}" approche de son échéance. Pensez à le restituer.`,
        });
    },

    // Notifie l'étudiant quand son statut change (approuvé/refusé)
    async notifyStatusChange(loan, type, equipmentName) {
        const messages = {
            [NotificationType.LOAN_APPROVED]:
                `Votre demande d'emprunt pour "${equipmentName}" a été approuvée.`,
            [NotificationType.LOAN_REJECTED]:
                `Votre demande d'emprunt pour "${equipmentName}" a été refusée.`,
        };

        return await Notification.create({
            studentMatricule: loan.studentId,
            loanId: loan._id,
            type,
            message: messages[type] || 'Mise à jour de votre demande.',
        });
    },

    // Récupère les notifications non lues d'un étudiant
    async getUnreadForStudent(matricule) {
        return await Notification.find({ studentMatricule: matricule, isRead: false })
            .populate('loanId')
            .sort({ createdAt: -1 });
    },

    // Récupère toutes les notifications d'un étudiant (lues + non lues)
    async getAllForStudent(matricule) {
        return await Notification.find({ studentMatricule: matricule })
            .populate({ path: 'loanId', populate: { path: 'equipmentId' } })
            .sort({ createdAt: -1 });
    },

    // Marque une notification comme lue
    async markAsRead(notificationId, matricule) {
        return await Notification.findOneAndUpdate(
            { _id: notificationId, studentMatricule: matricule },
            { isRead: true },
            { new: true }
        );
    },
};