import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { UserRoles } from '../config/constants.js';

export const AuthService = {
    async registerUser({ username, password, role, matricule }) {
        // const role = UserRoles.STUDENT;
        if (!username || !password) throw new Error('Champs requis manquants.');
        if (!matricule) throw new Error('Matricule obligatoire pour un étudiant.');
        // if (!username || !password || !role)
        //    throw new Error('Champs requis manquants.');
        if (!Object.values(UserRoles).includes(role))
            throw new Error('Rôle invalide.');
        if (role === UserRoles.STUDENT && !matricule)
            throw new Error('Matricule obligatoire pour un étudiant.');
        if (await User.findOne({ username }))
            throw new Error('Nom d\'utilisateur déjà pris.');
        if (role === UserRoles.STUDENT && await User.findOne({ matricule }))
            throw new Error('Matricule déjà enregistré.');

        const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds (not 10)
        return User.create({
            username, password: hashedPassword, role,
            matricule: role === UserRoles.STUDENT ? matricule : null,
        });
    },

    async loginUser(username, password) {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password)))
            throw new Error('Identifiants invalides.');

        const token = jwt.sign(
            { id: user._id.toString(), role: user.role, matricule: user.matricule },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        return { token, user: { username: user.username, role: user.role, matricule: user.matricule } };
    },
};