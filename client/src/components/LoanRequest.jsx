//import { useState, useContext } from 'react';
import axios from 'axios';
//import { AuthContext } from '../context/AuthContext';
//import { EquipmentStatus } from '../config/constants';

export default function LoanRequest() {
    const handleRequest = async (idDuMateriel) => {
    try {
        const response = await axios.post('http://localhost:5000/api/loans', { equipmentId: idDuMateriel });
        alert(response.data.message); // Notification de succès à l'étudiant
    } catch (err) {
        alert(err.response?.data?.error || "Erreur réseau");
    }
};
}