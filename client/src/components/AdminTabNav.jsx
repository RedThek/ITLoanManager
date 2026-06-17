import { useState } from "react";

export default function AdminTabNav() {

    const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' ou 'loans'

    return (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <button 
                onClick={() => setActiveTab('catalog')} 
                style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: activeTab === 'catalog' ? '#007BFF' : '#E2E8F0', color: activeTab === 'catalog' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Onglet 1: Gestion du Catalogue
            </button>
            <button 
                onClick={() => setActiveTab('loans')} 
                style={{ padding: '10px 20px', backgroundColor: activeTab === 'loans' ? '#007BFF' : '#E2E8F0', color: activeTab === 'loans' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Onglet 2: Tableau des Demandes
            </button>
            <button 
                onClick={() => setActiveTab('students')} 
                style={{ padding: '10px 20px', backgroundColor: activeTab === 'students' ? '#007BFF' : '#E2E8F0', color: activeTab === 'students' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Onglet 3 : Créer Étudiants
            </button>
            <button 
                onClick={() => setActiveTab('inventory')} 
                style={{ padding: '10px 20px', backgroundColor: activeTab === 'inventory' ? '#007BFF' : '#E2E8F0', color: activeTab === 'inventory' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Onglet 4 : Inventaire Complet
            </button>
            <button 
                onClick={() => setActiveTab('overdue')} 
                style={{ padding: '10px 20px', backgroundColor: activeTab === 'overdue' ? '#007BFF' : '#E2E8F0', color: activeTab === 'overdue' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                ⚠️ Onglet 5 : Retards            
            </button>
        </div>
    );
}