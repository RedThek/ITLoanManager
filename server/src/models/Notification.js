import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Types de notifications supportés — extensible sans modifier le schéma (Principe O)
export const NotificationType = Object.freeze({
    LOAN_APPROVED:  'LOAN_APPROVED',
    LOAN_REJECTED:  'LOAN_REJECTED',
    OVERDUE_WARNING: 'OVERDUE_WARNING',
    RETURN_REMINDER: 'RETURN_REMINDER',
});

const notificationSchema = new Schema({
    // Matricule de l'étudiant destinataire — cohérent avec Loan.studentId
    studentMatricule: { type: String, required: true, index: true },

    loanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan',
        required: true,
    },

    type: {
        type: String,
        required: true,
        enum: Object.values(NotificationType),
    },

    message: { type: String, required: true },

    isRead: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
}, {
    toJSON: { virtuals: true },
});

notificationSchema.index({ loanId: 1 });
notificationSchema.index({ studentMatricule: 1, isRead: 1 });

export const Notification = mongoose.models.Notification
    || model('Notification', notificationSchema);