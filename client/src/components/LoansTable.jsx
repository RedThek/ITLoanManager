import { useState } from "react";
import axios from 'axios';

export default function LoansTable() {

    const [loans, setLoans] = useState([]);

    const fetchLoans = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/loans');
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