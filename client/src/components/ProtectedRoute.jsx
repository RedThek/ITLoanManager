import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserRoles } from '../config/constants';

/**
 * Composant de protection de route basé sur l'authentification et les rôles.
 * @param {JSX.Element} children - Le composant de page à afficher si autorisé
 * @param {Array<string>} allowedRoles - Liste des rôles ayant accès à la route
 */
export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useContext(AuthContext);

    // 1. Pendant la phase de vérification du localStorage, afficher un indicateur visuel
    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Chargement de la session sécurisée...</div>;
    }

    // 2. Si l'utilisateur n'est pas connecté, redirection stricte vers la page d'authentification
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si des rôles spécifiques sont requis et que l'utilisateur n'en dispose pas
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirection intelligente selon son véritable rôle pour éviter les blocages de navigation
        return <Navigate to={user.role === UserRoles.ADMIN ? "/admin" : "/student"} replace />;
    }

    // 4. Si toutes les conditions sont remplies, rendu du composant cible
    return children;
}