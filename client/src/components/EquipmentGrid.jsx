import { useState } from "react";

export default function EquipmentGrid () {

    const [search, setSearch]     = useState('');
    const [filterCat, setFilter]  = useState('');
    const [filterStatus, setFSt]  = useState('');

    const filtered = equipments
    .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    .filter(e => !filterCat    || e.category === filterCat)
    .filter(e => !filterStatus || e.status   === filterStatus);

    return(
        <div>

        </div>
    );
}