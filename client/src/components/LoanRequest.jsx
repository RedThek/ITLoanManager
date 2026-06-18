//import { useState, useContext } from 'react';
import api from '../services/api.js';
//import { AuthContext } from '../context/AuthContext';
//import { EquipmentStatus } from '../config/constants';

export default function LoanRequest() {
    const handleRequest = async (idDuMateriel) => {
        try {
            const response = await api.post('/loans', { equipmentId: idDuMateriel });
            alert(response.data.message); // Notification de succès à l'étudiant
        } catch (err) {
            alert(err.response?.data?.error || "Erreur réseau");
        }
    };

    return (
        <button onClick={() => handleRequest()}>
            Hello
        </button>
    )
}