import React, { useState, useContext } from 'react';
import api from '../services/api'
import { AuthContext } from '../context/AuthContext';
import { EquipmentStatus } from '../config/constants';

export default React.memo(function EquipmentCard({ equipment, onActionSuccess }) {
    const { user } = useContext(AuthContext);
    const [matriculeInput, setMatriculeInput] = useState('');
    const [showForm, setShowForm] = useState(false);

    const isAvailable = equipment.status === EquipmentStatus.IN_STOCK;

    const handleLoanRequest = async (e) => {
        e.preventDefault();
        try {
            await api.post('/loans', {
                equipmentId: equipment.id,
                studentMatricule: user.matricule || matriculeInput // Capture le matricule saisi ou de session
            });
            alert("Demande d'emprunt enregistrée !");
            setShowForm(false);
            if (onActionSuccess) onActionSuccess();
        } catch (err) {
            alert(err.response?.data?.error || "Erreur lors de la demande.");
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', margin: '10px' }}>
            <h4>{equipment.name}</h4>
            <p>Catégorie : {equipment.category}</p>
            <span style={{ color: isAvailable ? 'green' : 'red', fontWeight: 'bold' }}>
                ● {equipment.status}
            </span>
            <br /><br />
            
            <button 
                disabled={!isAvailable}
                onClick={() => setShowForm(!showForm)}
                style={{ backgroundColor: isAvailable ? '#007BFF' : '#6C757D', color: 'white', padding: '6px 12px', border: 'none', cursor: isAvailable ? 'pointer' : 'not-allowed' }}
            >
                Demander
            </button>

            {showForm && (
                <form onSubmit={handleLoanRequest} style={{ marginTop: '10px' }}>
                    {!user.matricule && (
                        <input 
                            type="text" 
                            placeholder="Saisir votre Matricule"
                            value={matriculeInput} 
                            onChange={e => setMatriculeInput(e.target.value)} 
                            required 
                        />
                    )}
                    <button type="submit" style={{ marginLeft: '5px' }}>Confirmer</button>
                </form>
            )}
        </div>
    );
})