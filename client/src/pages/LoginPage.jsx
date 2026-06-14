import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useContext(AuthContext);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await loginUser(username, password);
            if (user.role === 'ADMIN') navigate('/admin');
            else navigate('/student');
        } catch (err) {
            setError(err.response?.data?.error || "Connexion échouée.");
        }
    };

    return (
        <div style={{ maxWidth: '350px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '6px' }}>
            <h2>Authentification Labo IT</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleFormSubmit}>
                <div style={{ marginBottom: '12px' }}>
                    <label>Nom d'utilisateur :</label>
                    <input 
                        type="text" 
                        value={username}
                        placeholder="Entrez votre nom d'utilisateur"
                        onChange={e => setUsername(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }} 
                        required
                    />
                </div>
                <div style={{ marginBottom: '12px' }}>
                    <label>Mot de passe :</label>
                    <input 
                        type="password" 
                        value={password}
                        placeholder="Entrez votre mot de passe"
                        onChange={e => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }} 
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28A745', color: '#fff', border: 'none', cursor: 'pointer' }}>Se connecter</button>
            </form>
        </div>
    );
}