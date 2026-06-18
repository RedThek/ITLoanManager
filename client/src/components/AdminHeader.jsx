import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function AdminHeader() {

    const { user, logoutUser } = useContext(AuthContext);

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
                <div>
                    <h2>Panneau d'Administration — Labo IT</h2>
                    <p>Session active : <strong>{user?.username}</strong> (Responsable)</p>
                </div>
                <button onClick={logoutUser} style={{ padding: '10px 15px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Déconnexion
                </button>
        </header>
    );
}