import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService.js';

// Principe S : n'affiche que le badge de comptage et gère l'ouverture
export default function NotificationBell({ onOpen }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const c = await notificationService.getUnreadCount();
                setCount(c);
            } catch {
                // Silencieux si l'étudiant n'est pas connecté
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 30000); // Rafraîchissement toutes les 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <button onClick={onOpen} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem' }} title="Notifications">
            🔔
            {count > 0 && (
                <span style={{
                    position: 'absolute', top: '-5px', right: '-5px',
                    background: '#E53E3E', color: 'white', borderRadius: '50%',
                    width: '18px', height: '18px', fontSize: '11px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold',
                }}>
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </button>
    );
}