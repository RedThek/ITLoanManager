
export default function StudentTabNav ({ activeTab, onTabChange }) {

    // Style pour les futurs onglets
    const tabStyle = (tab) => ({
        padding: '10px 20px',
        backgroundColor: activeTab === tab ? '#007BFF' : '#E2E8F0',
        color: activeTab === tab ? 'white' : 'black',
        border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
        marginRight: '10px',
    });

    return(
        <div style={{ marginTop: '15px' }}>
            <button onClick={() => onTabChange('catalog')} style={ tabStyle('catalog') }>
                Catalogue
            </button>
            <button onClick={() => onTabChange('history')} style={ tabStyle('history') }>
                Mes Demandes
            </button>
        </div>
    );
}