import express from 'express';
import {
    getMyNotifications,
    getUnreadCount,
    markNotificationAsRead,
} from '../controllers/notificationController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Toutes les routes de notifications nécessitent une authentification
router.get('/', authenticateToken, getMyNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.patch('/:id/read', authenticateToken, markNotificationAsRead);

export default router;