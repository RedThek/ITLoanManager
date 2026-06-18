import { AuthService } from '../services/authService.js';
import { User } from '../models/index.js'
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        const newUser = await AuthService.registerUser(req.body);
        return res.status(201).json({ message: 'Utilisateur créé.', userId: newUser._id });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await AuthService.loginUser(req.body.username, req.body.password);
        return res.json(result);
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    return res.json({ message: 'Déconnexion réussie. Veuillez supprimer le token côté client.' });
};

// La route reset doit aussi recevoir un nouveau mot de passe
// et le hasher avant de le sauvegarder
export const reset = async (req, res) => {
    try {
        const { matricule, newPassword } = req.body;
        if (!matricule || !newPassword)
            return res.status(400).json({ error: 'Matricule et nouveau mot de passe requis.' });
        if (newPassword.length < 6)
            return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères.' });

        const user = await User.findOne({ matricule });
        if (!user)
            return res.status(404).json({ error: 'Aucun compte trouvé pour ce matricule.' });

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
        return res.json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};