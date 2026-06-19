import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
    createEquipment, 
    getAllEquipments,
    getEquipmentById 
} from '../controllers/equipmentController.js';
import { validateEquipment } from '../middlewares/validationMiddleware.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

const equipmentRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

// Route sécurisée : Seuls les administrateurs authentifiés peuvent ajouter du matériel
router.post('/', equipmentRateLimiter, authenticateToken, requireRole('ADMIN'), validateEquipment, createEquipment);
router.get('/', equipmentRateLimiter, authenticateToken, getAllEquipments);
router.get('/:id', equipmentRateLimiter, authenticateToken, getEquipmentById);

export default router;