import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const addEquipmentAPI = async (equipmentData) => {
    // Récupération du token JWT stocké dans le localStorage local
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_URL}/equipments`, equipmentData, {
        headers: {
            'Authorization': `Bearer ${token}` // Transmission sécurisée du jeton d'authentification
        }
    });
    return response.data;
};