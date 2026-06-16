import { NotificationService } from '../services/NotificationService.js';

// Principe S : convertit les requêtes HTTP en appels de service, rien de plus.

export const getMyNotifications = async (req, res) => {
    try {
        const matricule = req.user.matricule;
        if (!matricule) {
            return res.status(403).json({ error: "Seuls les étudiants ont des notifications." });
        }
        const notifications = await NotificationService.getAllForStudent(matricule);
        return res.json(notifications);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const matricule = req.user.matricule;
        if (!matricule) return res.json({ count: 0 });

        const unread = await NotificationService.getUnreadForStudent(matricule);
        return res.json({ count: unread.length });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const matricule = req.user.matricule;
        const updated = await NotificationService.markAsRead(id, matricule);
        if (!updated) return res.status(404).json({ error: "Notification introuvable." });
        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};