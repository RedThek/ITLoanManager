import { useState, useEffect } from 'react';
import api from '../services/api.js';

export default function OverdueLoansTable() {
    const [overdueLoans, setOverdueLoans] = useState([]);
    const [alertingSent, setAlertingSent] = useState({});

    useEffect(() => {
        api.get('/admin/loans/overdue')
            .then(r => setOverdueLoans(r.data))
            .catch(err => console.error(err));
    }, []);

    const sendAlert = async (loanId) => {
        try {
            await api.post(`/admin/loans/${loanId}/alert`);
            setAlertingSent(prev => ({ ...prev, [loanId]: true }));
            alert("Alerte envoyée à l'étudiant.");
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || "Erreur lors de l'envoi.";
            alert(msg);
        }
    };

    if (overdueLoans.length === 0) {
        return <p style={{ textAlign: 'center', color: '#38A169' }}>✅ Aucun emprunt en retard actuellement.</p>;
    }

    return (
        <div>
            <h3 style={{ color: '#C53030' }}>⚠️ Emprunts en retard ({overdueLoans.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#FFF5F5', textAlign: 'left' }}>
                        <th style={{ padding: '10px', border: '1px solid #FED7D7' }}>Matricule</th>
                        <th style={{ padding: '10px', border: '1px solid #FED7D7' }}>Équipement</th>
                        <th style={{ padding: '10px', border: '1px solid #FED7D7' }}>Emprunté depuis</th>
                        <th style={{ padding: '10px', border: '1px solid #FED7D7' }}>Jours écoulés</th>
                        <th style={{ padding: '10px', border: '1px solid #FED7D7' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {overdueLoans.map(loan => (
                        <tr key={loan._id} style={{ borderBottom: '1px solid #FED7D7' }}>
                            <td style={{ padding: '10px' }}>{loan.studentId}</td>
                            <td style={{ padding: '10px' }}>{loan.equipmentId?.name || '—'}</td>
                            <td style={{ padding: '10px' }}>{new Date(loan.requestDate).toLocaleDateString('fr-FR')}</td>
                            <td style={{ padding: '10px', color: '#C53030', fontWeight: 'bold' }}>
                                {loan.daysElapsed} jours
                            </td>
                            <td style={{ padding: '10px' }}>
                                <button
                                    onClick={() => sendAlert(loan._id)}
                                    disabled={alertingSent[loan._id]}
                                    style={{
                                        backgroundColor: alertingSent[loan._id] ? '#A0AEC0' : '#E53E3E',
                                        color: 'white', border: 'none', padding: '6px 12px',
                                        borderRadius: '4px', cursor: alertingSent[loan._id] ? 'default' : 'pointer',
                                    }}
                                >
                                    {alertingSent[loan._id] ? 'Alerte envoyée' : 'Envoyer alerte'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
