import { useState } from 'react';
import { addEquipmentAPI } from '../services/equipmentService';

export default function AddEquipmentForm({ onEquipmentAdded }) {
    const [formData, setFormData] = useState({ name: '', category: '', referenceCode: '' });
    const [message, setMessage] = useState({ text: '', isError: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', isError: false });

        try {
            const result = await addEquipmentAPI(formData);
            setMessage({ text: `Équipement "${result.name}" ajouté avec succès !`, isError: false });
            setFormData({ name: '', category: '', referenceCode: '' }); // Réinitialisation du formulaire
            if (onEquipmentAdded) onEquipmentAdded(); // Déclenche un rafraîchissement de la liste
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Une erreur est survenue lors de l'enregistrement.";
            setMessage({ text: errorMsg, isError: true });
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px' }}>
            <h3>Ajouter un Nouvel Équipement (Admin)</h3> [cite: 62]
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nom de l'équipement :</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Catégorie :</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Code de Référence (S/N) :</label>
                    <input type="text" name="referenceCode" value={formData.referenceCode} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Enregistrer l'équipement
                </button>
            </form>
            {message.text && (
                <p style={{ marginTop: '15px', color: message.isError ? 'red' : 'green', fontWeight: 'bold' }}>
                    {message.text}
                </p>
            )}
        </div>
    );
}