import { createContext, useState, useEffect } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    //const [error, setError] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
            } catch (error) {
                error.response = { status: 401, data: { message: 'Données utilisateur corrompues.' } };
                // JSON corrompu : on nettoie
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const loginUser = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        //if (!error.response) setError("Serveur indisponible.");
        const { token, user: userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return userData;
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};