import { useState } from "react";
import api from '../services/api.js';

export default function LoansTable() {

    const [loans, setLoans] = useState([]);

    const fetchLoans = async () => {
        try {
            const response = await api.get('/loans');
            setLoans(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des demandes :", error);
        }
    };

    return (
        <div>

        </div>
    );
}