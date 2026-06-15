import express from 'express';
import { createEquipment, getAllEquipments } from '../controllers/equipmentController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route sécurisée : Seuls les administrateurs authentifiés peuvent ajouter du matériel
router.post('/equipments', authenticateToken, requireRole('ADMIN'), createEquipment);
router.get('/equipments', authenticateToken, getAllEquipments);

export default router;