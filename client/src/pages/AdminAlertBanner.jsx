import { useState } from 'react';

export default function AdminAlertBanner() {

    const [alertCount, setAlertCount] = useState(0);

    return (
        <div>
                {alertCount > 0 && (
                    <div style={{ backgroundColor: '#FFF5F5', borderLeft: '4px solid #E53E3E', padding: '15px', margin: '15px 0', borderRadius: '4px' }}>
                        <p style={{ color: '#C53030', margin: 0, fontWeight: 'bold' }}>
                            Notification Système : {alertCount} nouvelle(s) demande(s) d'étudiant(s) en attente de traitement instantané !
                        </p>
                    </div>
                )}
                {/* Reste des onglets du Dashboard */}
        </div>
    );
}