import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { UserRoles } from '../config/constants.js';

export const register = async (req, res) => {
    try {
        const { username, password, role, matricule } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Champs requis manquants.' });
        }

        if (!Object.values(UserRoles).includes(role)) {
            return res.status(400).json({ error: 'Rôle spécifié invalide.' });
        }

        if (role === UserRoles.STUDENT && !matricule) {
            return res.status(400).json({ error: 'Le matricule est obligatoire pour les étudiants.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'Ce nom utilisateur est déjà pris.' });

        if (role === UserRoles.STUDENT) {
            const existingMatricule = await User.findOne({ matricule });
            if (existingMatricule) return res.status(400).json({ error: 'Ce matricule est déjà enregistré.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            role,
            matricule: role === UserRoles.STUDENT ? matricule : null
        });

        return res.status(201).json({ message: 'Utilisateur créé avec succès', userId: newUser._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Identifiants invalides.' });
        }

        const token = jwt.sign(
            { id: user._id.toString(), role: user.role, matricule: user.matricule },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({ token, user: { username: user.username, role: user.role, matricule: user.matricule } });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    return res.json({ message: 'Déconnexion réussie. Veuillez supprimer le token côté client.' });
};

export const reset = (req, res) => {
    try {
        const { matricule } = req.body;
        const user = await User.findOne({ matricule });

        if (!user || !(matricule === user.matricule)) {
            return res.status(401).json({ error: 'Matricule invalide.' });
        }

        return res.json({ user: { username: user.username, role: user.role, matricule: user.matricule } }); 

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};