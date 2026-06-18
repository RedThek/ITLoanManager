import { useState, useEffect, useCallback } from 'react';
import AdminHeader from '../components/AdminHeader.jsx';
import AdminAlertBanner from './AdminAlertBanner.jsx';
import AdminTabNav from '../components/AdminTabNav.jsx';
import LoansTable from '../components/LoansTable.jsx';
import AddEquipmentForm from '../components/AddEquipmentForm.jsx';
//import AdminLoanRow from '../components/AdminLoanRow.jsx';
import AdminInventoryManager from '../components/AdminInventoryManager.jsx';
import AddStudentForm from '../components/AddStudentForm.jsx';
import OverdueLoansTable from '../components/OverdueLoansTable.jsx';
import api from '../services/api.js';

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' ou 'loans'
    const [loans, setLoans] = useState([]);
    const [alertCount, setAlertCount] = useState(0);
    const [inventory, setInventory] = useState();

    const fetchInventory = async () => {
        try {
            const response = await api.get('/equipments');
            setInventory(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des equipements " + error);
        }
    }

    const fetchLoans = useCallback(async () => {
        const response = await api.get('/loans');
        setLoans(response.data);
    }, []); // stable, ne change jamais

    const TAB_CONTENT = {
        catalog:   <AddEquipmentForm onEquipmentAdded={fetchInventory} />,
        loans:     <LoansTable loans={loans} onStatusChange={fetchLoans} />,
        students:  <AddStudentForm />,
        inventory: <AdminInventoryManager />,
        overdue:   <OverdueLoansTable />,
    };

    useEffect(() => {
        const checkRequests = async () => {
            try {
                const res = await api.get('/loans/pending-count');
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

            <AdminHeader/>

            <AdminAlertBanner/>

            {/* Menu de navigation par Onglets */}
            <AdminTabNav activeTab={activeTab} onTabChange={setActiveTab} />

            <main style={{ background: '#F8F9FA', padding: '20px', borderRadius: '8px' }}>
                {TAB_CONTENT[activeTab] ?? null}
            </main>
        </div>
    );
}