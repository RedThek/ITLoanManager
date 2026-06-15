import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { UserRoles } from '../config/constants.js';

export const createUserDynamically = async (req, res) => {
    try {
        const { username, password, role, matricule } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Tous les champs requis ne sont pas fournis.' });
        }

        if (role === UserRoles.STUDENT && !matricule) {
            return res.status(400).json({ error: 'Le matricule est obligatoire pour un étudiant.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Nom d\'utilisateur déjà existant.' });
        }

        if (role === UserRoles.STUDENT) {
            const existingMatricule = await User.findOne({ matricule });
            if (existingMatricule) {
                return res.status(400).json({ error: 'Ce matricule est déjà enregistré.' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
            username,
            password: hashedPassword,
            role,
            matricule: role === UserRoles.STUDENT ? matricule : null
        });

        return res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: { id: createdUser._id, username: createdUser.username, role: createdUser.role }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};