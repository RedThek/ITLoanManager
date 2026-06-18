// client/src/components/AddStudentForm.jsx
import { useState } from 'react';
import api from '../services/api.js';
import { UserRoles } from '../config/constants.js';

export default function AddStudentForm({ onStudentAdded }) {
    const [formData, setFormData] = useState({ username: '', password: '', matricule: '' });
    const [message, setMessage] = useState({ text: '', isError: false });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/users', {
                ...formData,
                role: UserRoles.STUDENT
            });
            setMessage({ text: res.data.message || 'Étudiant créé avec succès.', isError: false });
            setFormData({ username: '', password: '', matricule: '' });
            if (onStudentAdded) onStudentAdded();
        } catch (error) {
            setMessage({ text: error.response?.data?.error || "Erreur lors de la création.", isError: true });
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px' }}>
            <h3>Créer un compte Étudiant</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nom d'utilisateur :</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Mot de passe :</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Matricule :</label>
                    <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Créer l'étudiant
                </button>
            </form>
            {message.text && (
                <p style={{ marginTop: '15px', color: message.isError ? 'red' : 'green', fontWeight: 'bold' }}>{message.text}</p>
            )}
        </div>
    );
}