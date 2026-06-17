import { useState } from 'react';

export default function StudentTabNav () {

    const [activeTab, setActiveTab] = useState('catalog');

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
            <button onClick={() => setActiveTab('catalog')} style={ tabStyle('catalog') }>
                Catalogue
            </button>
            <button onClick={() => setActiveTab('history')} style={ tabStyle('catalog') }>
                Mes Demandes
            </button>
        </div>
    );
}