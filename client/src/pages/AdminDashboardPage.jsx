import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import AddEquipmentForm from '../components/AddEquipmentForm';
import AdminLoanRow from '../components/AdminLoanRow';
import axios from 'axios';

export default function AdminDashboardPage() {
    const { user, logoutUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' ou 'loans'
    const [loans, setLoans] = useState([]);
    const [alertCount, setAlertCount] = useState(0);

    const fetchLoans = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/loans');
            setLoans(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des demandes :", error);
        }
    };

    useEffect(() => {
        const checkRequests = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/loans/pending-count');
                setAlertCount(res.data.pendingCount);
            } catch (err) {
                console.error("Erreur de synchronisation du compteur");
                console.error(err);
            }
        };
        if (activeTab === 'loans') {
            checkRequests();
            fetchLoans();
        }
    }, [activeTab]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
                <div>
                    <h2>Panneau d'Administration — Labo IT</h2>
                    <p>Session active : <strong>{user?.username}</strong> (Responsable)</p>
                </div>
                <button onClick={logoutUser} style={{ padding: '10px 15px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Déconnexion
                </button>
            </header>

            <div>
                {alertCount > 0 && (
                    <div style={{ backgroundColor: '#FFF5F5', borderLeft: '4px solid #E53E3E', padding: '15px', margin: '15px 0', borderRadius: '4px' }}>
                        <p style={{ color: '#C53030', margin: 0, fontWeight: 'bold' }}>
                            ⚠️ Notification Système : {alertCount} nouvelle(s) demande(s) d'étudiant(s) en attente de traitement instantané !
                        </p>
                    </div>
                )}
                {/* Reste des onglets du Dashboard */}
            </div>

            {/* Menu de navigation par Onglets exigé par le cahier des charges */}
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
            </div>

            <main style={{ background: '#F8F9FA', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                {activeTab === 'catalog' ? (
                    <div>
                        <AddEquipmentForm onEquipmentAdded={() => alert('Équipement synchronisé dans la base !')} />
                    </div>
                ) : (
                    <div>
                        <h3>Suivi des demandes d'emprunts et de restitutions</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#fff' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#EDF2F7', textAlign: 'left' }}>
                                    <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Matricule Étudiant</th>
                                    <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Équipement Ciblé</th>
                                    <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Date Demande</th>
                                    <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Statut Actuel</th>
                                    <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Actions Résolutives</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.length === 0 ? (
                                    <tr><td colSpan="5" style={{ padding: '15px', textAlign: 'center' }}>Aucune demande enregistrée.</td></tr>
                                ) : (
                                    loans.map((loan) => (
                                        <AdminLoanRow key={loan.id} loan={loan} onStatusChange={fetchLoans} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}