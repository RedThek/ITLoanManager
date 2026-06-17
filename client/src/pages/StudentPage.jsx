import { useEffect, useState } from 'react';
import StudentHeader from './StudentHeader.jsx'
import StudentTabNav from './StudentTabNav.jsx'
import StudentLoanHistory from '../components/StudentLoanHistory';
import api from '../services/api.js';
import EquipmentGrid from '../components/EquipmentGrid.jsx';
import EquipmentCard from '../components/EquipmentCard';

export default function StudentPage() {
    const [equipments, setEquipments] = useState([]);
    const [activeTab, setActiveTab] = useState('catalog');

    // Fonction de récupération de l'inventaire matériel depuis le backend
    const fetchInventory = async () => {
        try {
            const response = await api.get('/equipments');
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
            
            <StudentHeader/>

            <StudentTabNav/>

            <main style={{ marginTop: '20px' }}>
                {activeTab === 'catalog' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {equipments.map((item) => (
                                <EquipmentCard key={item.id} equipment={item} onActionSuccess={fetchInventory} />
                            ))}
                        </div>
                    ) : (
                        <StudentLoanHistory />
                    )
                }
            </main>
        </div>
    );
}