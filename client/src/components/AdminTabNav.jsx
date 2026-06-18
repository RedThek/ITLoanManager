
export default function AdminTabNav({ activeTab, onTabChange }) {

    return (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <button 
                onClick={() => onTabChange('catalog')} 
                style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: activeTab === 'catalog' ? '#007BFF' : '#E2E8F0', color: activeTab === 'catalog' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Onglet 1: Gestion du Catalogue
            </button>
            <button 
                onClick={() => onTabChange('loans')} 
                style={{ padding: '10px 20px', backgroundColor: activeTab === 'loans' ? '#007BFF' : '#E2E8F0', color: activeTab === 'loans' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Onglet 2: Tableau des Demandes
            </button>
            <button 
                onClick={() => onTabChange('students')} 
                style={{ padding: '10px 20px', backgroundColor: activeTab === 'students' ? '#007BFF' : '#E2E8F0', color: activeTab === 'students' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Onglet 3 : Créer Étudiants
            </button>
            <button 
                onClick={() => onTabChange('inventory')} 
                style={{ padding: '10px 20px', backgroundColor: activeTab === 'inventory' ? '#007BFF' : '#E2E8F0', color: activeTab === 'inventory' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Onglet 4 : Inventaire Complet
            </button>
            <button 
                onClick={() => onTabChange('overdue')} 
                style={{ padding: '10px 20px', backgroundColor: activeTab === 'overdue' ? '#007BFF' : '#E2E8F0', color: activeTab === 'overdue' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                ⚠️ Onglet 5 : Retards            
            </button>
        </div>
    );
}