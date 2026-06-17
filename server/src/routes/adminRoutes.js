import express from 'express';
import { 
    getAllUsers, 
    getOverdueLoans, 
    triggerManualAlert, 
    updateEquipment, 
    deleteEquipment, 
    updateUser, 
    deleteUser, 
} from '../controllers/adminController.js';
import { register } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Application du chaînage de middlewares : Authentification puis Contrôle du rôle Admin
router.use(authenticateToken, requireAdmin);

router.get('/users', getAllUsers); // Récupération de tous les utilisateurs enregistrés
router.get('/loans/overdue', getOverdueLoans);
router.post('/loans/:loanId/alert', triggerManualAlert);
router.post('/users', register); // Création d'étudiants (ou admins) par un admin connecté

// Routes Équipements
router.put('/equipments/:id', updateEquipment);
router.delete('/equipments/:id', deleteEquipment);

// Routes Utilisateurs
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/users/:id',           getUserById);
router.patch('/users/:id/password', updateUserPassword);
router.get('/loans/:id',           getLoanById);
router.delete('/loans/:id',        deleteLoan);

export default router;