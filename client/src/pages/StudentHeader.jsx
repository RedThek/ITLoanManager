import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

export default function StudentHeader() {

    const { user, logoutUser } = useContext(AuthContext);
        const [showNotifs, setShowNotifs] = useState(false);

    return (
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
    );
}