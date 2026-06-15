import { sqlitePrisma, mongodbPrisma } from '../config/db.js';

// =========================================================================
// GESTION DES ÉQUIPEMENTS (MATÉRIEL)
// =========================================================================

export const updateEquipment = async (req, res) => {
    const { id } = req.params;
    const { name, category, status, referenceCode } = req.body;

    try {
        const parsedId = parseInt(id);

        // 1. Mise à jour dans SQLite
        const updatedSqlite = await sqlitePrisma.equipment.update({
            where: { id: parsedId },
            data: { name, category, status, referenceCode }
        });

        // 2. Mise à jour miroir dans MongoDB (Correspondance basée sur le code de référence unique)
        await mongodbPrisma.equipment.updateMany({
            where: { referenceCode: updatedSqlite.referenceCode },
            data: { name, category, status }
        });

        return res.json({ message: "Équipement mis à jour avec succès dans les deux bases.", equipment: updatedSqlite });
    } catch (error) {
        return res.status(500).json({ error: "Échec de la mise à jour : " + error.message });
    }
};

export const deleteEquipment = async (req, res) => {
    const { id } = req.params;

    try {
        const parsedId = parseInt(id);

        // Récupération de l'équipement pour obtenir son code de référence unique avant suppression
        const equipment = await sqlitePrisma.equipment.findUnique({ where: { id: parsedId } });
        if (!equipment) return res.status(404).json({ error: "Équipement introuvable." });

        // Vérification d'intégrité : Interdire la suppression si le matériel fait l'objet d'un prêt actif
        const activeLoans = await sqlitePrisma.loan.findMany({
            where: { equipmentId: parsedId, status: "Approuve" }
        });
        if (activeLoans.length > 0) {
            return res.status(400).json({ error: "Impossible de supprimer un équipement en cours d'emprunt." });
        }

        // Suppression synchronisée
        await sqlitePrisma.equipment.delete({ where: { id: parsedId } });
        await mongodbPrisma.equipment.deleteMany({ where: { referenceCode: equipment.referenceCode } });

        return res.json({ message: "Équipement radié de l'inventaire avec succès." });
    } catch (error) {
        return res.status(500).json({ error: "Erreur lors de la suppression : " + error.message });
    }
};

// =========================================================================
// GESTION DES UTILISATEURS
// =========================================================================

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, role, matricule } = req.body;

    try {
        const parsedId = parseInt(id);

        const updatedUser = await sqlitePrisma.user.update({
            where: { id: parsedId },
            data: { username, role, matricule },
            select: { id: true, username: true, role: true, matricule: true }
        });

        // Synchronisation MongoDB basée sur le nom d'utilisateur unique
        await mongodbPrisma.user.updateMany({
            where: { username: updatedUser.username },
            data: { role, matricule }
        });

        return res.json({ message: "Profil utilisateur synchronisé et mis à jour.", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const parsedId = parseInt(id);
        const user = await sqlitePrisma.user.findUnique({ where: { id: parsedId } });
        if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

        // Suppression en cascade ou sécurisée
        await sqlitePrisma.user.delete({ where: { id: parsedId } });
        await mongodbPrisma.user.deleteMany({ where: { username: user.username } });

        return res.json({ message: `L'utilisateur [${user.username}] a été supprimé du système.` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};