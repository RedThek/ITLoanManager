import { useEffect, useState } from 'react';
import StudentHeader from './StudentHeader.jsx'
import StudentTabNav from './StudentTabNav.jsx'
import StudentLoanHistory from '../components/StudentLoanHistory';
import api from '../services/api.js';
//import EquipmentGrid from '../components/EquipmentGrid.jsx';
import EquipmentCatalog from '../components/EquipmentCatalog.jsx';

export default function StudentPage() {
    const [equipments, setEquipments] = useState([]);
    const [activeTab, setActiveTab] = useState('catalog');

    // Fonction de récupération de l'inventaire matériel depuis le backend
    const fetchInventory = async () => {
        try {
            const res = await api.get('/equipments');
            const list = res.data?.data ?? res.data ?? [];
            setEquipments(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error("Erreur lors du chargement de l'inventaire :", error);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            
            <StudentHeader/>

            <StudentTabNav activeTab={activeTab} onTabChange={setActiveTab} />

            <main style={{ marginTop: '20px' }}>
                {activeTab === 'catalog'
                    ? <EquipmentCatalog />
                    : <StudentLoanHistory />
                }
            </main>
        </div>
    );
}