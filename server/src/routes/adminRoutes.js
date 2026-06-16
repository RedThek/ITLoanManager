import express from 'express';
import { updateEquipment, deleteEquipment, updateUser, deleteUser } from '../controllers/adminController.js';
import { register } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Application du chaînage de middlewares : Authentification puis Contrôle du rôle Admin
router.use(authenticateToken, requireAdmin);

router.post('/users', register); // Création d'étudiants (ou admins) par un admin connecté

// Routes Équipements
router.put('/equipments/:id', updateEquipment);
router.delete('/equipments/:id', deleteEquipment);

// Routes Utilisateurs
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;