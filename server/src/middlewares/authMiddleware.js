import jwt from 'jsonwebtoken';

// Authentifier le token JWT
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraction du format "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Stockage des données du token décodé dans l'objet de requête
        next(); // Passage au middleware suivant
    } catch (err) {
        res.status(403).json({ error: "Token invalide ou expiré." });
    }
};

// Vérifier les rôles autorisés (SOLID - Ségrégation)
export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: "Action interdite. Droits insuffisants." });
        }
        next();
    };
};