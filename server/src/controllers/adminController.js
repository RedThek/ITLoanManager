import { User, Equipment, Loan } from '../models/index.js';
import { EquipmentStatus, LoanStatus, UserRoles } from '../config/constants.js';

export const updateEquipment = async (req, res) => {
    const { id } = req.params;
    const { name, category, status, referenceCode } = req.body;

    try {
        // On utilise findByIdAndUpdate avec l'option { new: true } pour retourner l'objet modifié
        const updated = await Equipment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: "Équipement non trouvé" });
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