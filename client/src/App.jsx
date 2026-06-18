//import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import StudentPage from './pages/StudentPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import EditEquipmentPage from './pages/EditEquipmentPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { UserRoles } from './config/constants.js';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Route Publique : Page d'authentification */}
                <Route path="/login" element={<LoginPage />} />

                {/* Route Sécurisée Espace Étudiant - Rôle STUDENT requis */}
                <Route 
                    path="/student" 
                    element={
                        <ProtectedRoute allowedRoles={[UserRoles.STUDENT]}>
                            <StudentPage />
                        </ProtectedRoute>
                    } 
                />

                {/* Route Sécurisée Espace Administration - Rôle ADMIN requis */}
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute allowedRoles={[UserRoles.ADMIN]}>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    } 
                />
                <Route
                    path="/admin/equipment/edit/:id"
                    element={<EditEquipmentPage />}
                />

                {/* Route de capture globale : Redirection automatique vers /login pour tout chemin inconnu */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}