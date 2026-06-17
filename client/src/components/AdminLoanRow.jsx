//import React from 'react';
import api from '../services/api'
import { LoanStatus } from '../config/constants';

export default function AdminLoanRow({ loan, onStatusChange }) {
    const handleAction = async (targetStatus) => {
        try {
            await api.patch(`/loans/${loan._id}/status`, { status: targetStatus });
            onStatusChange();
        } catch (err) {
            alert("Erreur lors de la modification du statut.");
            console.error(err);
        }
    };

    return (
        <tr>
            <td>{loan.studentId}</td>
            <td>{loan.equipmentId?.name || "Chargement..."}</td>
            <td>{new Date(loan.requestDate).toLocaleDateString()}</td>
            <td><strong>{loan.status}</strong></td>
            <td>
                {loan.status === LoanStatus.PENDING && (
                    <>
                        <button onClick={() => handleAction(LoanStatus.APPROVED)} style={{ backgroundColor: 'green', color: 'white', marginRight: '5px' }}>Approuver</button>
                        <button onClick={() => handleAction(LoanStatus.REJECTED)} style={{ backgroundColor: 'red', color: 'white' }}>Refuser</button>
                    </>
                )}
                {loan.status === LoanStatus.APPROVED && (
                    <button onClick={() => handleAction(LoanStatus.FINISHED)} style={{ backgroundColor: 'blue', color: 'white' }}>Déclarer Rendu</button>
                )}
            </td>
        </tr>
    );
}