import express from 'express';
import { createUserDynamically } from '../controllers/userController.js';

const router = express.Router();

// Déclaration de la route dynamique d'inscription
router.post('/users/register-dynamic', createUserDynamically);

export default router;