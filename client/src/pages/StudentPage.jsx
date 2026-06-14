import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import EquipmentCard from '../components/EquipmentCard';

export default function StudentPage() {
    const { user, logoutUser } = useContext(AuthContext);
    const [equipments, setEquipments] = useState([]);

    // Fonction de récupération de l'inventaire matériel depuis le backend
    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/equipments');
            setEquipments(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement de l'inventaire :", error);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'beteen', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <div>
                    <h2>Espace Étudiant — Gestion de Prêts IT</h2>
                    <p>Bienvenue, <strong>{user?.username}</strong> (Matricule : {user?.matricule || 'N/A'})</p>
                </div>
                <button onClick={logoutUser} style={{ padding: '10px 15px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Déconnexion
                </button>
            </header>

            <main style={{ marginTop: '20px' }}>
                <h3>Catalogue des Équipements du Laboratoire</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {equipments.map((item) => (
                        <EquipmentCard 
                            key={item.id} 
                            equipment={item} 
                            onActionSuccess={fetchInventory} // Rafraîchissement automatique après une demande d'emprunt
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}