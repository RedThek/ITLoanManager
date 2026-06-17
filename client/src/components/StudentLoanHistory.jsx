import { useState, useEffect } from 'react';
import api from '../services/api'
import { LoanStatus } from '../config/constants';

const STATUS_COLOR = {
    [LoanStatus.PENDING]:  { bg: '#FEFCBF', text: '#744210', label: '⏳ En attente' },
    [LoanStatus.APPROVED]: { bg: '#C6F6D5', text: '#22543D', label: '✅ Approuvée' },
    [LoanStatus.REJECTED]: { bg: '#FED7D7', text: '#742A2A', label: '❌ Refusée' },
    [LoanStatus.FINISHED]: { bg: '#EDF2F7', text: '#2D3748', label: '🏁 Terminée' },
};

export default function StudentLoanHistory() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/loans')
            .then(response => { setLoans(response.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement de vos demandes...</p>;
    if (loans.length === 0) return <p style={{ textAlign: 'center', color: '#718096' }}>Vous n'avez formulé aucune demande d'emprunt.</p>;

    return (
        <div>
            <h3>Historique de vos demandes</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#EDF2F7', textAlign: 'left' }}>
                        <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Équipement</th>
                        <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Date de demande</th>
                        <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Échéance</th>
                        <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map(loan => {
                        const style = STATUS_COLOR[loan.status] || {};
                        return (
                            <tr key={loan._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '10px' }}>{loan.equipmentId?.name || '—'}</td>
                                <td style={{ padding: '10px' }}>{new Date(loan.requestDate).toLocaleDateString('fr-FR')}</td>
                                <td style={{ padding: '10px' }}>
                                    {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('fr-FR') : '—'}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{ backgroundColor: style.bg, color: style.text, padding: '3px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
                                        {style.label || loan.status}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}