export const requireAdmin = (req, res, next) => {
    // req.user est injecté au préalable par le middleware d'authentification token
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ 
            error: "Accès refusé. Cette opération nécessite des privilèges d'administrateur." 
        });
    }
    next(); // L'utilisateur est admin, on passe au contrôleur suivant
};