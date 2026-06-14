import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UserRoles } from '../config/constants.js';

const prisma = new PrismaClient();

export const register = async (req, res) => {
    try {
        const { username, password, role, matricule } = req.body;

        // 1. Validations strictes des rôles
        if (!username || !password || !role) {
            return res.status(400).json({ error: "Champs requis manquants." });
        }
        if (!Object.values(UserRoles).includes(role)) {
            return res.status(400).json({ error: "Rôle spécifié invalide." });
        }
        if (role === UserRoles.STUDENT && !matricule) {
            return res.status(400).json({ error: "Le matricule est obligatoire pour les étudiants." });
        }

        // 2. Vérification des doublons
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) return res.status(400).json({ error: "Ce nom d'utilisateur est déjà pris." });

        if (role === UserRoles.STUDENT) {
            const existingMatricule = await prisma.user.findUnique({ where: { matricule } });
            if (existingMatricule) return res.status(400).json({ error: "Ce matricule est déjà enregistré." });
        }

        // 3. Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Création de l'utilisateur
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
                matricule: role === UserRoles.STUDENT ? matricule : null
            }
        });

        return res.status(201).json({ message: "Utilisateur créé avec succès", userId: newUser.id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Identifiants invalides." });
        }

        // Génération du Token contenant le rôle et le matricule
        const token = jwt.sign(
            { id: user.id, role: user.role, matricule: user.matricule },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({ token, user: { username: user.username, role: user.role, matricule: user.matricule } });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    
    return res.json({ message: "Déconnexion réussie. Veuillez supprimer le token côté client." });
}