import { useState } from 'react';
import { UserRoles } from '../config/constants.js';
import api from '../services/api.js';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: UserRoles.STUDENT,
        matricule: '',
        targetDb: 'mongodb' // Valeur par défaut
    });
    const [uiMessage, setUiMessage] = useState({ text: '', isError: false });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setUiMessage({ text: '', isError: false });

        try {
            // Envoi des données vers la route dynamique du serveur backend
            const response = await api.post('/users/register-dynamic', formData);
            setUiMessage({ text: response.data.message, isError: false });
            // Réinitialisation partielle
            setFormData({ ...formData, username: '', password: '', matricule: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Erreur lors de la communication avec le serveur.";
            setUiMessage({ text: errorMsg, isError: true });
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '25px', border: '1px solid #CBD5E0', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Création de Compte Dynamique</h3>
            
            <form onSubmit={handleFormSubmit}>
                {/* Choix de la Base de Données Cible */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Base de Données Cible :</label>
                    <select name="targetDb" value={formData.targetDb} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="sqlite">SQLite (Fichier Relationnel Local)</option>
                        <option value="mongodb">MongoDB (NoSQL Document Réseau)</option>
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Nom d'utilisateur :</label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Mot de passe :</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Rôle de l'utilisateur :</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value={UserRoles.STUDENT}>Étudiant</option>
                        <option value={UserRoles.ADMIN}>Administrateur (Responsable Labo)</option>
                    </select>
                </div>

                {/* Affichage conditionnel du matricule si le rôle sélectionné est étudiant */}
                {formData.role === UserRoles.STUDENT && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>Matricule Académique :</label>
                        <input type="text" name="matricule" value={formData.matricule} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
                    </div>
                )}

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Enregistrer l'utilisateur
                </button>
            </form>

            {uiMessage.text && (
                <div style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', backgroundColor: uiMessage.isError ? '#FED7D7' : '#C6F6D5', color: uiMessage.isError ? '#C53030' : '#22543D', fontWeight: 'bold', textAlign: 'center' }}>
                    {uiMessage.text}
                </div>
            )}
        </div>
    );
}