import express from 'express';
import { createEquipment, getAllEquipments } from '../controllers/equipmentController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route sécurisée : Seuls les administrateurs authentifiés peuvent ajouter du matériel
router.post('/', authenticateToken, requireRole('ADMIN'), createEquipment);
router.get('/', authenticateToken, getAllEquipments);
router.get('/:id', authenticateToken, getEquipmentById);

export default router;