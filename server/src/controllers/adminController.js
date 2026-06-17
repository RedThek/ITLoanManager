import { User, Equipment, Loan } from '../models/index.js';
import { EquipmentStatus, LoanStatus, UserRoles } from '../config/constants.js';
import { LoanMonitoringService } from '../services/loanMonitoringService.js';
import { NotificationService } from '../services/notificationService.js';

export const updateEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await Equipment.findByIdAndUpdate(id, req.body, {
            new: true, runValidators: true
        });
        if (!updated) return res.status(404).json({ error: 'Équipement non trouvé.' });
        return res.json(updated);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const deleteEquipment = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Equipment.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Équipement non trouvé" });
        return res.json({ message: "Équipement supprimé avec succès de MongoDB." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, role, matricule } = req.body;

    try {
        if (!username && !role && !matricule) {
            return res.status(400).json({ error: 'Aucune donnée de mise à jour fournie.' });
        }

        if (role && !Object.values(UserRoles).includes(role)) {
            return res.status(400).json({ error: 'Rôle spécifié invalide.' });
        }

        if (role === UserRoles.STUDENT && !matricule) {
            return res.status(400).json({ error: 'Le matricule est obligatoire pour les étudiants.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, role, matricule },
            { new: true, runValidators: true }
        ).select('id username role matricule');

        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur introuvable.' });
        }

        return res.json({ message: 'Profil utilisateur mis à jour.', user: updatedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

        await Loan.deleteMany({ studentId: user._id });
        await User.deleteOne({ _id: user._id });

        return res.json({ message: `L'utilisateur [${user.username}] a été supprimé du système.` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Lister tous les utilisateurs (pour la vue admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')  // Ne jamais renvoyer le mot de passe hashé
            .sort({ createdAt: -1 });
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Lister les emprunts en retard
export const getOverdueLoans = async (req, res) => {
    try {
        const overdueLoans = await LoanMonitoringService.getOverdueLoans();
        // Enrichir avec le nombre de jours de retard
        const enriched = overdueLoans.map(loan => ({
            ...loan.toJSON(),
            daysElapsed: LoanMonitoringService.calculateDaysElapsed(loan),
        }));
        return res.json(enriched);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Déclencher manuellement une alerte pour un prêt spécifique
export const triggerManualAlert = async (req, res) => {
    try {
        const { loanId } = req.params;
        const loan = await Loan.findById(loanId).populate('equipmentId');
        if (!loan) return res.status(404).json({ error: "Prêt introuvable." });

        const notification = await NotificationService.createOverdueWarning(loan);
        if (!notification) {
            return res.status(409).json({ message: "Une alerte a déjà été envoyée pour ce prêt." });
        }
        return res.json({ message: "Alerte envoyée avec succès.", notification });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};