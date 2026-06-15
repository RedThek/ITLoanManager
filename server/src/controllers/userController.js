import bcrypt from 'bcryptjs';
import { sqlitePrisma, mongodbPrisma } from '../config/db.js';
import { UserRoles } from '../config/constants.js';

export const createUserDynamically = async (req, res) => {
    try {
        const { username, password, role, matricule, targetDb } = req.body;

        // 1. Validations de base
        if (!username || !password || !role || !targetDb) {
            return res.status(400).json({ error: "Tous les champs y compris la base cible sont requis." });
        }

        if (role === UserRoles.STUDENT && !matricule) {
            return res.status(400).json({ error: "Le matricule est obligatoire pour un étudiant." });
        }

        // 2. Chiffrement du mot de passe (Sécurité unifiée)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const payload = {
            username,
            password: hashedPassword,
            role,
            matricule: role === UserRoles.STUDENT ? matricule : null
        };

        // 3. Routage dynamique vers la base choisie par l'utilisateur
        let createdUser = null;

        if (targetDb === 'sqlite') {
            // Vérification de doublon dans SQLite
            const existing = await sqlitePrisma.user.findUnique({ where: { username } });
            if (existing) return res.status(400).json({ error: "Nom d'utilisateur déjà existant dans SQLite." });

            createdUser = await sqlitePrisma.user.create({ data: payload });
        } 
        else if (targetDb === 'mongodb') {
            // Vérification de doublon dans MongoDB
            const existing = await mongodbPrisma.user.findUnique({ where: { username } });
            if (existing) return res.status(400).json({ error: "Nom d'utilisateur déjà existant dans MongoDB." });

            createdUser = await mongodbPrisma.user.create({ data: payload });
        } 
        else {
            return res.status(400).json({ error: "Base de données cible invalide. Choisissez 'sqlite' ou 'mongodb'." });
        }

        return res.status(201).json({
            message: `Utilisateur créé avec succès dans la base [${targetDb.toUpperCase()}]`,
            user: { id: createdUser.id, username: createdUser.username, role: createdUser.role }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};