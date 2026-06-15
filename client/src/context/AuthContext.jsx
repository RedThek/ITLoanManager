import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setUser(JSON.parse(savedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
        setLoading(false);
    }, []);

    const loginUser = async (username, password) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        const { token, user: userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return userData;
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};