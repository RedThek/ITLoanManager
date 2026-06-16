import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentLoanHistory from '../components/StudentLoanHistory';
import NotificationBell from '../components/NotificationBell';
import axios from 'axios';
import EquipmentCard from '../components/EquipmentCard';

export default function StudentPage() {
    const { user, logoutUser } = useContext(AuthContext);
    const [equipments, setEquipments] = useState([]);

    const [activeTab, setActiveTab] = useState('catalog');
    const [showNotifs, setShowNotifs] = useState(false);

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
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <div>
                    <h2>Espace Étudiant — Gestion de Prêts IT</h2>
                    <p>Bienvenue, <strong>{user?.username}</strong> (Matricule : {user?.matricule || 'N/A'})</p>
                </div>
                <button onClick={logoutUser} style={{ padding: '10px 15px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Déconnexion
                </button>
                <NotificationBell onOpen={() => setShowNotifs(!showNotifs)} />
            </header>

            <div style={{ marginTop: '15px' }}>
                <button onClick={() => setActiveTab('catalog')} style={{ /* style actif/inactif */ }}>
                    Catalogue
                </button>
                <button onClick={() => setActiveTab('history')} style={{ /* style actif/inactif */ }}>
                    Mes Demandes
                </button>
            </div>

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