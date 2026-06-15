import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminInventoryManager() {
    const [equipments, setEquipments] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: '', status: 'En stock', referenceCode: '' });

    const API_URL = 'http://localhost:5000/api';

    // Récupération initiale de l'inventaire complet
    const fetchInventory = async () => {
        try {
            const res = await axios.get(`${API_URL}/equipments`);
            setEquipments(res.data);
        } catch (err) {
            alert("Erreur lors de la récupération du catalogue.");
            console.error(err);
        }
    };

    useEffect(() => { fetchInventory(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous certain de vouloir radier cet équipement de l'inventaire ?")) {
            try {
                // Utilisation du token d'authentification stocké localement (ex: localStorage)
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/admin/equipments/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Équipement supprimé.");
                fetchInventory(); // Rechargement dynamique de la liste 
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.error || "Erreur lors de la suppression.");
            }
        }
    };

    const startEdit = (equip) => {
        setEditingItem(equip.id);
        setFormData({ name: equip.name, category: equip.category, status: equip.status, referenceCode: equip.referenceCode });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/admin/equipments/${editingItem}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Mise à jour effectuée !");
            setEditingItem(null);
            fetchInventory();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Erreur lors de la modification.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>🛠️ Panel de Gestion de l'Inventaire (Réservé Admin)</h3>
            
            {editingItem && (
                <form onSubmit={handleUpdateSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #4299E1', borderRadius: '5px' }}>
                    <h4>Modifier l'équipement</h4>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Nom de l'appareil" />
                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required placeholder="Catégorie" />
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="En stock">En stock</option>
                        <option value="Emprunte">Emprunté</option>
                        <option value="Maintenance">En maintenance</option>
                    </select>
                    <button type="submit" style={{ marginLeft: '10px', backgroundColor: '#48BB78', color: 'white' }}>Enregistrer les modifications</button>
                    <button type="button" onClick={() => setEditingItem(null)} style={{ marginLeft: '5px' }}>Annuler</button>
                </form>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#EDF2F7', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Code Réf</th>
                        <th>Désignation</th>
                        <th>Catégorie</th>
                        <th>Statut</th>
                        <th>Actions administratives</th>
                    </tr>
                </thead>
                <tbody>
                    {equipments.map(equip => (
                        <tr key={equip.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '10px' }}>{equip.referenceCode}</td>
                            <td>{equip.name}</td>
                            <td>{equip.category}</td>
                            <td><strong>{equip.status}</strong></td>
                            <td>
                                <button onClick={() => startEdit(equip)} style={{ marginRight: '5px', backgroundColor: '#ECC94B' }}>Modifier</button>
                                <button onClick={() => handleDelete(equip.id)} style={{ backgroundColor: '#F56565', color: 'white' }}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}